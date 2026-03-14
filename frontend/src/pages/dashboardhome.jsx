import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const DashboardHome = () => {
  
  // --- UPDATED LOGIC START ---
  const [userInfo, setUserInfo] = useState({ username: "User", role: "Employee" });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        username: parsedUser.username, // <--- This reads the name you just saved
        role: parsedUser.role || "Employee"
      });
    }
  }, []);
  
  // Issue reporting UI state
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '', priority: 'medium' });

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      const res = await axios.post('http://localhost:5000/api/issues/report', issueForm, { headers: { Authorization: `Bearer ${token}` } });
      alert('Issue reported to admin');
      setIssueForm({ title: '', description: '', priority: 'medium' });
      setShowIssueForm(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to report issue');
    }
  };
  // Dashboard summary from backend
  const [summaryData, setSummaryData] = useState({
    activeTasks: 0,
    pendingDeadline: "—",
    nextMeeting: "—",
    nextHoliday: "—",
    unreadNotices: 0,
    pendingLeaves: 0
  });
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      axios.get('http://localhost:5000/api/dashboard/summary', { headers: { Authorization: `Bearer ${t}` } })
        .then((res) => setSummaryData({
          activeTasks: res.data.activeTasks ?? 0,
          pendingDeadline: res.data.pendingDeadline ?? "—",
          nextMeeting: res.data.nextMeeting ?? "—",
          nextHoliday: res.data.nextHoliday ?? "—",
          unreadNotices: res.data.unreadNotices ?? 0,
          pendingLeaves: res.data.pendingLeaves ?? 0
        }))
        .catch(() => {});
    }
  }, []);

  return (
    <div>
      {/* --- HEADER --- */}
      <div style={{ marginBottom: "30px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: "#1e293b", fontSize: "28px" }}>
            🏠 Welcome Back, {userInfo.username}!
          </h2>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Here is what's happening today at SyncFlow.</p>
        </div>
        <div>
          <button onClick={() => setShowIssueForm(s => !s)}>Report Issue</button>
        </div>
      </div>

      {showIssueForm && (
        <div style={{ marginBottom: '20px', background: '#fff', padding: '12px', borderRadius: '8px' }}>
          <h3>Report an Issue</h3>
          <form onSubmit={handleIssueSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input required placeholder="Title" value={issueForm.title} onChange={e => setIssueForm({ ...issueForm, title: e.target.value })} />
            <input placeholder="Description" value={issueForm.description} onChange={e => setIssueForm({ ...issueForm, description: e.target.value })} />
            <select value={issueForm.priority} onChange={e => setIssueForm({ ...issueForm, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {/* --- DASHBOARD BLOCKS GRID --- */}
      <div style={styles.gridContainer}>

        {/* 1. PROFILE BLOCK */}
        <Link to="/dashboard/profile" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, borderLeft: "5px solid #3498db" }}>
            <div style={styles.icon}>👤</div>
            <h3 style={styles.cardTitle}>My Profile</h3>
            {/* Display Dynamic Name Here Too */}
            <p style={styles.text}>{userInfo.username}</p> 
            <span style={styles.badge}>{userInfo.role}</span>
          </div>
        </Link>

        {/* 2. TIMESHEET BLOCK */}
        <Link to="/dashboard/timesheet" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, borderLeft: "5px solid #f1c40f" }}>
            <div style={styles.icon}>📅</div>
            <h3 style={styles.cardTitle}>Timesheet</h3>
            <p style={styles.text}><strong>{summaryData.activeTasks}</strong> Tasks Active</p>
            <p style={{ fontSize: "13px", color: "#e74c3c", fontWeight: "bold" }}>Deadline: {summaryData.pendingDeadline}</p>
          </div>
        </Link>

        {/* 3. MEETINGS BLOCK */}
        <Link to="/dashboard/meeting" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, borderLeft: "5px solid #9b59b6" }}>
            <div style={styles.icon}>🤝</div>
            <h3 style={styles.cardTitle}>Meetings</h3>
            <p style={styles.text}>Next: {summaryData.nextMeeting}</p>
            <button style={styles.smallBtn}>Join Now</button>
          </div>
        </Link>

        {/* 4. HOLIDAY BLOCK */}
        <Link to="/dashboard/holiday" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, borderLeft: "5px solid #2ecc71" }}>
            <div style={styles.icon}>🎉</div>
            <h3 style={styles.cardTitle}>Holidays</h3>
            <p style={styles.text}>Upcoming: {summaryData.nextHoliday}</p>
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>{summaryData.pendingLeaves ? `${summaryData.pendingLeaves} leave request(s) pending.` : 'No leave requests pending.'}</p>
          </div>
        </Link>

        {/* 5. NOTICE BLOCK */}
        <Link to="/dashboard/notice" style={{ textDecoration: 'none' }}>
          <div style={{ ...styles.card, borderLeft: "5px solid #e74c3c" }}>
            <div style={styles.icon}>📢</div>
            <h3 style={styles.cardTitle}>Notices</h3>
            <p style={styles.text}><strong>{summaryData.unreadNotices}</strong> New Updates</p>
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>Check Company Policies</p>
          </div>
        </Link>

      </div>

      {/* --- WHITEBOARD SECTION --- */}
      <div style={styles.whiteboardContainer}>
        <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>📝 Quick Remarks</h3>
        <RemarksBoard pageName="Dashboard Home" />
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
    gap: "25px",
    marginBottom: "40px"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    height: "100%",
    textAlign: "left",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    color: "#334155",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  cardTitle: {
    margin: "10px 0",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1e293b"
  },
  icon: {
    fontSize: "28px",
    marginBottom: "5px"
  },
  text: {
    margin: "5px 0",
    fontSize: "15px",
    color: "#475569"
  },
  badge: {
    display: "inline-block",
    background: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#475569",
    marginTop: "8px"
  },
  smallBtn: {
    background: "#9b59b6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  whiteboardContainer: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  }
};

export default DashboardHome;