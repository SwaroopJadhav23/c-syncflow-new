import React, { useState } from 'react';
import RemarksBoard from '../components/remarksboard';

const Meeting = () => {
  // 1. STATE: List of Meetings
  // Added 'joinId' and 'password' to the dummy data
  const [meetings, setMeetings] = useState([
    { 
      id: 1, 
      time: "10:00 AM", 
      title: "Daily Standup", 
      type: "Zoom", 
      joinId: "890-123-4567", 
      password: "scrum" 
    },
    { 
      id: 2, 
      time: "02:00 PM", 
      title: "Client Demo - Project Alpha", 
      type: "Google Meet", 
      joinId: "meet.google.com/abc-xyz", 
      password: "(No Password)" 
    },
    { 
      id: 3, 
      time: "04:30 PM", 
      title: "Sprint Retrospective", 
      type: "Conference Room A", 
      joinId: "Room A - 2nd Floor", 
      password: "N/A" 
    }
  ]);

  // 2. FUNCTION: Handle Cancel Meeting
  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this meeting?");
    if (confirmCancel) {
      // Filter out the meeting with the matching ID
      setMeetings(meetings.filter((meeting) => meeting.id !== id));
      alert("Meeting has been cancelled.");
    }
  };

  // 3. FUNCTION: Copy text to clipboard (Optional utility)
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div>
      <h2>🤝 Scheduled Meetings</h2>
      <p>Your timeline and joining credentials for today.</p>

      {/* MEETING LIST */}
      <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
        {meetings.length > 0 ? (
          meetings.map((meet) => (
            <div key={meet.id} className="card" style={styles.meetingCard}>
              
              {/* LEFT SIDE: Time & Details */}
              <div style={{ textAlign: "left", flex: 1 }}>
                <h3 style={{ margin: "0", color: "#2c3e50" }}>{meet.time}</h3>
                <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "16px" }}>{meet.title}</p>
                <span style={styles.badge}>📍 {meet.type}</span>
              </div>

              {/* MIDDLE: Credentials (ID & Pass) */}
              <div style={styles.credentialsBox}>
                <div style={styles.credRow}>
                  <span style={{color: '#7f8c8d'}}>Join ID:</span> 
                  <span 
                    style={styles.credValue} 
                    onClick={() => copyToClipboard(meet.joinId)}
                    title="Click to Copy"
                  >
                    {meet.joinId} 📋
                  </span>
                </div>
                <div style={styles.credRow}>
                  <span style={{color: '#7f8c8d'}}>Password:</span> 
                  <span style={styles.credValue}>{meet.password}</span>
                </div>
              </div>

              {/* RIGHT SIDE: Actions */}
              <div style={styles.actionButtons}>
                <button 
                  style={styles.joinBtn} 
                  onClick={() => alert(`Joining ${meet.title}...`)}
                >
                  Join Meeting
                </button>
                
                <button 
                  style={styles.cancelBtn} 
                  onClick={() => handleCancel(meet.id)}
                >
                  Cancel
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="card">
            <p style={{ color: "gray" }}>No meetings scheduled for today. Enjoy your time! 🎉</p>
          </div>
        )}
      </div>

      {/* Whiteboard for meeting minutes or quick notes */}
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
    flexWrap: "wrap", // Makes it responsive on smaller screens
    gap: "15px"
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
  credValue: {
    fontWeight: "bold",
    color: "#333",
    cursor: "pointer"
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  joinBtn: {
    background: "#27ae60", 
    color: "white", 
    border: "none", 
    padding: "8px 15px", 
    borderRadius: "5px", 
    cursor: "pointer",
    fontWeight: "bold"
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