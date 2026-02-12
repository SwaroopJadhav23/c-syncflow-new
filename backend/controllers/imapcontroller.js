const imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const SyncedMeeting = require('../models/syncedmeeting');

// 1. IMPROVED LINK EXTRACTOR (Handles Zoom, Teams, and Google Meet)
const extractMeetingLink = (text) => {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  return urls.find(url => 
    url.includes('zoom.us') || 
    url.includes('teams.microsoft') || 
    url.includes('meet.google.com')
  ) || '';
};

exports.syncViaImap = async (req, res) => {
  const { email, appPassword, host } = req.body;
  const config = {
    imap: {
      user: email,
      password: appPassword,
      host: host || 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      tlsOptions: { rejectUnauthorized: false }
    }
  };

  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    // 2. IMPROVED SEARCH (Finds more meeting types)
    const searchCriteria = [
      ['OR', 
        ['HEADER', 'SUBJECT', 'Meeting'], 
        ['OR', 
          ['HEADER', 'SUBJECT', 'Invite'], 
          ['OR', ['HEADER', 'SUBJECT', 'Zoom'], ['HEADER', 'SUBJECT', 'Schedule']]
        ]
      ]
    ];

    const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };
    const messages = await connection.search(searchCriteria, fetchOptions);
    
    let count = 0;
    for (const item of messages) {
      const uid = item.attributes.uid;
      const uniqueId = `IMAP-${email}-${uid}`;

      const exists = await SyncedMeeting.findOne({ messageId: uniqueId });
      if (exists) continue;

      const fullBodyPart = item.parts.find(p => p.which === '');
      if (!fullBodyPart) continue;

      const parsed = await simpleParser(fullBodyPart.body);
      const link = extractMeetingLink(parsed.text || parsed.html);

      // 3. STORE IN DB
      await SyncedMeeting.create({
        userId: req.user.id,
        subject: parsed.subject || "No Subject",
        sender: parsed.from?.text || "Unknown",
        receivedDate: parsed.date || new Date(),
        messageId: uniqueId,
        meetingLink: link,
        platform: 'IMAP'
      });
      count++;
    }

    connection.end();
    res.json({ success: true, msg: `Synced ${count} new meetings.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "IMAP Error. Check App Password." });
  }
};

exports.getSyncedList = async (req, res) => {
  try {
    const meetings = await SyncedMeeting.find({ userId: req.user.id }).sort({ receivedDate: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};