import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import io from 'socket.io-client'; // Temporarily disabled

// Fallback socket implementation
const fallbackSocket = {
  emit: () => {},
  on: () => {},
  close: () => {}
};

const io = (url) => fallbackSocket; // Simple fallback
import RemarksBoard from '../components/remarksboard';

const Meeting = () => {
  // 1. STATE
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    meetingLink: '',
    meetingTime: ''
  });
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  // 2. SOCKET SETUP
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Initialize socket connection
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);
      
      // Join user room
      newSocket.emit('join', parsedUser._id);
      
      // Listen for new notifications
      newSocket.on('new_notification', (notification) => {
        alert(`🔔 ${notification.title}: ${notification.message}`);
        fetchMeetings(); // Refresh meetings list
      });
      
      return () => newSocket.close();
    }
  }, []);

  // 3. FETCH: Get meetings from backend
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/meetings/list', {
        headers: { 'x-auth-token': token }
      });
      setMeetings(res.data);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // 4. CREATE MEETING: Handle form submission
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/meetings/create', formData, {
        headers: { 'x-auth-token': token }
      });
      alert(res.data.msg);
      fetchMeetings(); // Refresh list after successful creation
      setShowCreateForm(false);
      setFormData({ topic: '', meetingLink: '', meetingTime: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  // 5. COPY TO CLIPBOARD
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
          <p>Admin-managed meetings with real-time notifications.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            style={styles.createToggleBtn}
          >
            {showCreateForm ? "Cancel" : "� Create Meeting"}
          </button>
        )}
      </div>

      {/* CREATE MEETING FORM - ADMIN ONLY */}
      {showCreateForm && user?.role === 'admin' && (
        <div className="card" style={styles.createFormCard}>
          <h4>Create New Meeting</h4>
          <form onSubmit={handleCreateMeeting} style={styles.createForm}>
            <input 
              type="text" 
              placeholder="Meeting Topic (Optional)" 
              style={styles.input}
              value={formData.topic}
              onChange={e => setFormData({...formData, topic: e.target.value})} 
            />
            <input 
              type="url" 
              placeholder="Meeting Link (Required)" 
              required
              style={styles.input}
              value={formData.meetingLink}
              onChange={e => setFormData({...formData, meetingLink: e.target.value})} 
            />
            <input 
              type="datetime-local" 
              placeholder="Meeting Time" 
              required
              style={styles.input}
              value={formData.meetingTime}
              onChange={e => setFormData({...formData, meetingTime: e.target.value})} 
            />
            <button type="submit" disabled={loading} style={styles.createBtn}>
              {loading ? "Creating..." : "Create Meeting"}
            </button>
          </form>
        </div>
      )}

      {/* MEETING LIST */}
      <div style={{ display: "grid", gap: "20px", marginBottom: "30px", marginTop: "20px" }}>
        {meetings.length > 0 ? (
          meetings.map((meet) => (
            <div key={meet._id} className="card" style={styles.meetingCard}>
              
              {/* LEFT SIDE: Meeting Time & Topic */}
              <div style={{ textAlign: "left", flex: 1 }}>
                <h3 style={{ margin: "0", color: "#2c3e50" }}>
                  {new Date(meet.meetingTime).toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </h3>
                <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "16px" }}>
                  {meet.topic || 'Meeting'}
                </p>
                <span style={styles.badge}>� Created by: {meet.createdBy?.name || 'Admin'}</span>
              </div>

              {/* MIDDLE: Meeting Details */}
              <div style={styles.detailsBox}>
                <div style={styles.detailRow}>
                  <span style={{color: '#7f8c8d'}}>Status:</span> 
                  <span style={styles.detailValue}>
                    {new Date(meet.meetingTime) > new Date() ? (
                      <span style={{color: '#27ae60'}}>🟢 Upcoming</span>
                    ) : (
                      <span style={{color: '#e74c3c'}}>🔴 Past</span>
                    )}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={{color: '#7f8c8d'}}>Meeting Link:</span> 
                  <span 
                    style={meet.meetingLink ? styles.linkValue : styles.noLink} 
                    onClick={() => copyToClipboard(meet.meetingLink)}
                    title={meet.meetingLink ? "Click to Copy" : "No link found"}
                  >
                    {meet.meetingLink ? "Click to Copy Link 📋" : "None Provided"}
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
                  onClick={() => copyToClipboard(meet.meetingLink)}
                  disabled={!meet.meetingLink}
                >
                  {meet.meetingLink ? "Copy Link" : "No Link"}
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="card">
            <p style={{ color: "gray" }}>
              {loading ? "Loading meetings..." : "No meetings found. Admin users can create new meetings! �"}
            </p>
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
  createToggleBtn: {
    padding: "10px 15px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  createFormCard: {
    background: "#fdfdfd",
    border: "1px solid #e0e0e0",
    padding: "20px",
    marginTop: "10px",
    borderRadius: "8px"
  },
  createForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    margin: "10px 0"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    flex: 1
  },
  createBtn: {
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
  detailsBox: {
    backgroundColor: "#f9f9f9",
    border: "1px dashed #bdc3c7",
    padding: "10px",
    borderRadius: "6px",
    minWidth: "200px",
    fontSize: "13px"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px"
  },
  detailValue: { fontWeight: "bold", color: "#333" },
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