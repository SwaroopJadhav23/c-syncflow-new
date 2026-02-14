import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const Meeting = () => {
  // 1. STATE
  const [meetings, setMeetings] = useState([]); // Now empty, will be filled from DB
  const [loading, setLoading] = useState(false);
  const [syncVisible, setSyncVisible] = useState(false); // Toggle for Sync Form
  const [syncData, setSyncData] = useState({ email: '', appPassword: '' });

  // 2. FETCH: Get live meetings from your backend
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token'); // Assumes token is stored on login
      const res = await axios.get('http://localhost:5000/api/sync/list', {
        headers: { 'x-auth-token': token }
      });
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // 3. SYNC: Trigger the backend IMAP sync
  const handleImapSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/sync/imap-sync', syncData, {
        headers: { 'x-auth-token': token }
      });
      alert(res.data.msg);
      fetchMeetings(); // Refresh list after successful sync
      setSyncVisible(false);
    } catch (err) {
      alert("Sync failed. Ensure you are using a 16-digit App Password.");
    } finally {
      setLoading(false);
    }
  };

  // 4. CANCEL: Locally remove from UI (Ideally, add a delete route in backend later)
  const handleCancel = (id) => {
    if (window.confirm("Remove this meeting from your view?")) {
      setMeetings(meetings.filter((m) => m._id !== id));
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>🤝 Scheduled Meetings</h2>
          <p>Live meetings synced from your email inbox.</p>
        </div>
        <button 
          onClick={() => setSyncVisible(!syncVisible)} 
          style={styles.syncToggleBtn}
        >
          {syncVisible ? "Close Sync" : "🔄 Sync Email"}
        </button>
      </div>

      {/* SYNC FORM SECTION */}
      {syncVisible && (
        <div className="card" style={styles.syncFormCard}>
          <h4>Connect via IMAP (Gmail/Outlook)</h4>
          <form onSubmit={handleImapSync} style={styles.syncForm}>
            <input 
              type="email" placeholder="Email Address" required 
              style={styles.input}
              onChange={e => setSyncData({...syncData, email: e.target.value})} 
            />
            <input 
              type="password" placeholder="16-digit App Password" required 
              style={styles.input}
              onChange={e => setSyncData({...syncData, appPassword: e.target.value})} 
            />
            <button type="submit" disabled={loading} style={styles.startSyncBtn}>
              {loading ? "Syncing..." : "Start Sync"}
            </button>
          </form>
          <small style={{color: '#7f8c8d'}}>Tip: Use an 'App Password' from your Google Account Security settings.</small>
        </div>
      )}

      {/* MEETING LIST */}
      <div style={{ display: "grid", gap: "20px", marginBottom: "30px", marginTop: "20px" }}>
        {meetings.length > 0 ? (
          meetings.map((meet) => (
            <div key={meet._id} className="card" style={styles.meetingCard}>
              
              {/* LEFT SIDE: Received Time & Subject */}
              <div style={{ textAlign: "left", flex: 1 }}>
                <h3 style={{ margin: "0", color: "#2c3e50" }}>
                  {new Date(meet.receivedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
                <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "16px" }}>{meet.subject}</p>
                <span style={styles.badge}>📧 From: {meet.sender}</span>
              </div>

              {/* MIDDLE: Credentials / Link Details */}
              <div style={styles.credentialsBox}>
                <div style={styles.credRow}>
                  <span style={{color: '#7f8c8d'}}>Platform:</span> 
                  <span style={styles.credValue}>{meet.platform}</span>
                </div>
                <div style={styles.credRow}>
                  <span style={{color: '#7f8c8d'}}>Meeting Link:</span> 
                  <span 
                    style={meet.meetingLink ? styles.linkValue : styles.noLink} 
                    onClick={() => copyToClipboard(meet.meetingLink)}
                    title={meet.meetingLink ? "Click to Copy" : "No link found"}
                  >
                    {meet.meetingLink ? "Click to Copy Link 📋" : "None Detected"}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: Actions */}
              <div style={styles.actionButtons}>
                {meet.meetingLink ? (
                  <a 
                    href={meet.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.joinBtnLink}
                  >
                    Join Meeting
                  </a>
                ) : (
                  <button style={styles.disabledBtn} disabled>No Link</button>
                )}
                
                <button 
                  style={styles.cancelBtn} 
                  onClick={() => handleCancel(meet._id)}
                >
                  Dismiss
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="card">
            <p style={{ color: "gray" }}>{loading ? "Fetching meetings..." : "No meetings found. Click 'Sync Email' to fetch from your inbox! 📬"}</p>
          </div>
        )}
      </div>

      <RemarksBoard pageName="Meetings" />
    </div>
  );
};

// --- INTERNAL STYLES ---
const styles = {
  meetingCard: {
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  syncToggleBtn: {
    padding: "10px 15px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  syncFormCard: {
    background: "#fdfdfd",
    border: "1px solid #e0e0e0",
    padding: "20px",
    marginTop: "10px",
    borderRadius: "8px"
  },
  syncForm: {
    display: "flex",
    gap: "10px",
    margin: "10px 0"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    flex: 1
  },
  startSyncBtn: {
    padding: "10px 20px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  badge: {
    fontSize: "12px", 
    background: "#ecf0f1", 
    color: "#2c3e50", 
    padding: "4px 8px", 
    borderRadius: "4px",
    display: "inline-block",
    marginTop: "5px"
  },
  credentialsBox: {
    backgroundColor: "#f9f9f9",
    border: "1px dashed #bdc3c7",
    padding: "10px",
    borderRadius: "6px",
    minWidth: "200px",
    fontSize: "13px"
  },
  credRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px"
  },
  credValue: { fontWeight: "bold", color: "#333" },
  linkValue: { fontWeight: "bold", color: "#2980b9", cursor: "pointer" },
  noLink: { color: "#95a5a6", fontStyle: "italic" },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  joinBtnLink: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#27ae60",
    color: "white",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "14px",
    textAlign: "center"
  },
  disabledBtn: {
    background: "#bdc3c7",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "not-allowed"
  },
  cancelBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Meeting;