import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const DashboardHome = () => {
  // --- LOGIC (UNTOUCHED) ---
  const [userInfo, setUserInfo] = useState({ username: "User", role: "Employee" });
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '', priority: 'medium' });
  const [summaryData, setSummaryData] = useState({
    activeTasks: 0,
    pendingDeadline: "—",
    nextMeeting: "—",
    nextHoliday: "—",
    unreadNotices: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        username: parsedUser.username,
        role: parsedUser.role || "Employee"
      });
    }

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

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');
    try {
      await axios.post('http://localhost:5000/api/issues/report', issueForm, { headers: { Authorization: `Bearer ${token}` } });
      alert('Issue reported to admin');
      setIssueForm({ title: '', description: '', priority: 'medium' });
      setShowIssueForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to report issue');
    }
  };

  // --- RENDER ---
  return (
    <div style={styles.dashboardWrapper}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <span style={styles.workspaceTag}>✨ WORKSPACE ACTIVE</span>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.welcomeText}>
            Welcome back, <span style={styles.userName}>{userInfo.username}</span>. Here is your summary.
          </p>
        </div>
        <button style={styles.reportBtn} onClick={() => setShowIssueForm(s => !s)}>
          <span style={{marginRight: '8px'}}>⚠️</span> Report Incident
        </button>
      </div>

      {/* ISSUE FORM OVERLAY */}
      {showIssueForm && (
        <div style={styles.issueFormContainer}>
          <h3 style={{marginBottom: '15px'}}>Report an Issue</h3>
          <form onSubmit={handleIssueSubmit} style={styles.formGrid}>
            <input style={styles.input} required placeholder="Title" value={issueForm.title} onChange={e => setIssueForm({ ...issueForm, title: e.target.value })} />
            <input style={styles.input} placeholder="Description" value={issueForm.description} onChange={e => setIssueForm({ ...issueForm, description: e.target.value })} />
            <select style={styles.input} value={issueForm.priority} onChange={e => setIssueForm({ ...issueForm, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" style={styles.submitBtn}>Send</button>
          </form>
        </div>
      )}

      {/* 6-CARD GRID (As per image) */}
      <div style={styles.cardGrid}>
        
        {/* MY PROFILE */}
        <DashboardCard 
          to="/dashboard/profile"
          icon="👤"
          iconBg="#e0f2fe"
          iconColor="#0ea5e9"
          title="My Profile"
          desc="Personal info & settings"
          subText={`${userInfo.role}`}
        />

        {/* TIMESHEET */}
        <DashboardCard 
          to="/dashboard/timesheet"
          icon="🕒"
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          title="Timesheet"
          desc="Task tracking & hours"
          subText={`${summaryData.activeTasks} active tasks`}
        />

        {/* NOTICES */}
        <DashboardCard 
          to="/dashboard/notice"
          icon="🔔"
          iconBg="#fee2e2"
          iconColor="#ef4444"
          title="Notices"
          desc="Company announcements"
          subText={`${summaryData.unreadNotices} new updates`}
        />

        {/* HOLIDAYS */}
        <DashboardCard 
          to="/dashboard/holiday"
          icon="🌴"
          iconBg="#dcfce7"
          iconColor="#22c55e"
          title="Holidays"
          desc="Annual leave calendar"
          subText={summaryData.nextHoliday !== "—" ? `Next: ${summaryData.nextHoliday}` : "No upcoming holidays"}
        />

        {/* MEETINGS */}
        <DashboardCard 
          to="/dashboard/meeting"
          icon="📹"
          iconBg="#f3e8ff"
          iconColor="#a855f7"
          title="Meetings"
          desc="Video calls & syncs"
          subText={summaryData.nextMeeting !== "—" ? `Next: ${summaryData.nextMeeting}` : "No meetings scheduled"}
        />

        {/* PROJECTS (Newly added to match image) */}
        <DashboardCard 
          to="/dashboard/projects"
          icon="👥"
          iconBg="#e0e7ff"
          iconColor="#6366f1"
          title="Projects"
          desc="Team progress & goals"
          subText="View active projects"
        />

      </div>

      {/* COLLABORATION BOARD */}
      <div style={styles.collabContainer}>
        <div style={styles.collabHeader}>
          <span style={{fontSize: '20px'}}>⊞</span>
          <h3 style={{margin: 0, fontSize: '18px'}}>Collaboration Board</h3>
        </div>
        <div style={{padding: '10px 0'}}>
           <RemarksBoard pageName="Dashboard Home" />
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component for consistency
const DashboardCard = ({ to, icon, iconBg, iconColor, title, desc, subText }) => (
  <Link to={to} style={styles.cardLink}>
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={{ ...styles.iconCircle, backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
        <div style={styles.cardContent}>
          <h3 style={styles.cardTitle}>{title}</h3>
          <p style={styles.cardDesc}>{desc}</p>
          <p style={styles.cardSubText}>{subText}</p>
        </div>
      </div>
      <div style={styles.cardFooter}>
        <span>View Details</span>
        <span>→</span>
      </div>
    </div>
  </Link>
);

// --- UPDATED MODERN STYLES ---
const styles = {
  dashboardWrapper: {
    padding: "20px 40px",
    backgroundColor: "#fcfcfd",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px'
  },
  workspaceTag: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#4f46e5',
    letterSpacing: '0.5px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '4px 0'
  },
  welcomeText: {
    color: '#64748b',
    fontSize: '16px'
  },
  userName: {
    color: '#4f46e5',
    fontWeight: '600'
  },
  reportBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  cardLink: {
    textDecoration: 'none'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    height: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  cardTop: {
    padding: '24px',
    display: 'flex',
    gap: '20px',
    flex: 1
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  cardSubText: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '8px',
    fontWeight: '500'
  },
  cardFooter: {
    borderTop: '1px solid #f8fafc',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  collabContainer: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f1f5f9'
  },
  collabHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#334155',
    marginBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '15px'
  },
  issueFormContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '24px',
    border: '1px solid #fee2e2',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  formGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    flex: 1,
    minWidth: '150px'
  },
  submitBtn: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default DashboardHome;