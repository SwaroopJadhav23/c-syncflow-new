import React from 'react';
import { Link } from 'react-router-dom';
import RemarksBoard from '../components/remarksboard';

const DashboardHome = () => {
  // Mock Summary Data (In a real app, you would fetch this from your backend/API)
  const summaryData = {
    userName: "John Doe",
    userRole: "Employee",
    activeTasks: 5,
    pendingDeadline: "Today",
    nextMeeting: "10:00 AM - Standup",
    nextHoliday: "25 Dec - Christmas",
    unreadNotices: 2
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2>🏠 Welcome Back, {summaryData.userName}!</h2>
        <p style={{ color: "gray" }}>Here is what's happening today at SyncFlow.</p>
      </div>

      {/* --- DASHBOARD BLOCKS GRID --- */}
      <div style={styles.gridContainer}>

        {/* 1. PROFILE BLOCK */}
        <Link to="/dashboard/profile" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ ...styles.card, borderLeft: "5px solid #3498db" }}>
            <div style={styles.icon}>👤</div>
            <h3>My Profile</h3>
            <p style={styles.text}>{summaryData.userName}</p>
            <span style={styles.badge}>{summaryData.userRole}</span>
          </div>
        </Link>

        {/* 2. TIMESHEET BLOCK */}
        <Link to="/dashboard/timesheet" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ ...styles.card, borderLeft: "5px solid #f1c40f" }}>
            <div style={styles.icon}>📅</div>
            <h3>Timesheet</h3>
            <p style={styles.text}><strong>{summaryData.activeTasks}</strong> Tasks Active</p>
            <p style={{ fontSize: "12px", color: "red" }}>Deadline: {summaryData.pendingDeadline}</p>
          </div>
        </Link>

        {/* 3. MEETINGS BLOCK */}
        <Link to="/dashboard/meeting" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ ...styles.card, borderLeft: "5px solid #9b59b6" }}>
            <div style={styles.icon}>🤝</div>
            <h3>Meetings</h3>
            <p style={styles.text}>Next: {summaryData.nextMeeting}</p>
            <button style={styles.smallBtn}>Join Now</button>
          </div>
        </Link>

        {/* 4. HOLIDAY BLOCK */}
        <Link to="/dashboard/holiday" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ ...styles.card, borderLeft: "5px solid #2ecc71" }}>
            <div style={styles.icon}>🎉</div>
            <h3>Holidays</h3>
            <p style={styles.text}>Upcoming: {summaryData.nextHoliday}</p>
            <p style={{ fontSize: "12px", color: "gray" }}>No leave requests pending.</p>
          </div>
        </Link>

        {/* 5. NOTICE BLOCK */}
        <Link to="/dashboard/notice" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ ...styles.card, borderLeft: "5px solid #e74c3c" }}>
            <div style={styles.icon}>📢</div>
            <h3>Notices</h3>
            <p style={styles.text}><strong>{summaryData.unreadNotices}</strong> New Updates</p>
            <p style={{ fontSize: "12px", color: "gray" }}>Check Company Policies</p>
          </div>
        </Link>

      </div>

      {/* --- WHITEBOARD SECTION --- */}
      <RemarksBoard pageName="Dashboard Home" />
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Responsive Grid
    gap: "20px",
    marginBottom: "30px"
  },
  card: {
    height: "100%", // Make all cards same height
    textAlign: "left",
    transition: "transform 0.2s", // Hover effect
    cursor: "pointer",
    color: "#2c3e50" // Text color
  },
  icon: {
    fontSize: "30px",
    marginBottom: "10px"
  },
  text: {
    margin: "5px 0",
    fontSize: "14px"
  },
  badge: {
    background: "#ecf0f1",
    padding: "3px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#2c3e50"
  },
  smallBtn: {
    background: "#9b59b6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    marginTop: "5px",
    cursor: "pointer"
  }
};

export default DashboardHome;