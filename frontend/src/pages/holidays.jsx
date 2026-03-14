import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const API = 'http://localhost:5000/api';
const token = () => localStorage.getItem('token');

const Holiday = () => {
  const [leaveForm, setLeaveForm] = useState({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
  const [holidays, setHolidays] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/holidays`).then((res) => setHolidays(res.data)).catch(() => setHolidays([]));
    if (token()) {
      axios.get(`${API}/leaves/my`, { headers: { Authorization: `Bearer ${token()}` } }).then((res) => setMyLeaves(res.data)).catch(() => setMyLeaves([]));
    }
  }, []);

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!token()) { alert('Please login to submit leave.'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/leaves`, leaveForm, { headers: { Authorization: `Bearer ${token()}` } });
      alert('Leave request submitted.');
      setLeaveForm({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
      const res = await axios.get(`${API}/leaves/my`, { headers: { Authorization: `Bearer ${token()}` } });
      setMyLeaves(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to submit leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🎉 Holiday & Leave Management</h2>

      {/* SECTION 1: LEAVE REQUEST FORM */}
      <div className="card" style={{ marginBottom: "30px", textAlign: "left" }}>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", color: "#e67e22" }}>📝 Request Leave</h3>
        
        <form onSubmit={handleLeaveSubmit}>
          <div style={styles.gridContainer}>
            
            {/* Leave Subject / Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Leave Subject:</label>
              <select 
                name="type" 
                value={leaveForm.type} 
                onChange={handleLeaveChange} 
                style={styles.input}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Vacation">Vacation</option>
                <option value="Bereavement">Bereavement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Empty placeholder to keep grid aligned or add another field if needed */}
            <div style={styles.formGroup}></div> 

            {/* Start Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>From Date:</label>
              <input 
                type="date" 
                name="startDate" 
                value={leaveForm.startDate} 
                onChange={handleLeaveChange} 
                style={styles.input} 
                required 
              />
            </div>

            {/* End Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>To Date:</label>
              <input 
                type="date" 
                name="endDate" 
                value={leaveForm.endDate} 
                onChange={handleLeaveChange} 
                style={styles.input} 
                required 
              />
            </div>

            {/* Reason Text Area */}
            <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
              <label style={styles.label}>Reason / Comments:</label>
              <textarea 
                name="reason" 
                value={leaveForm.reason} 
                onChange={handleLeaveChange} 
                style={{ ...styles.input, height: "60px" }} 
                placeholder="Brief explanation for leave..."
              />
            </div>

          </div>

          <div style={{ textAlign: "right", marginTop: "15px" }}>
            <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
          </div>
        </form>
      </div>

      {/* My Leave Requests (from backend) */}
      {myLeaves.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>📋 My Leave Requests</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={styles.tdDate}>Type</th><th style={styles.tdDay}>From</th><th style={styles.tdDay}>To</th><th style={styles.tdName}>Status</th></tr></thead>
            <tbody>
              {myLeaves.map((l) => (
                <tr key={l._id}>
                  <td style={styles.tdDate}>{l.type}</td>
                  <td style={styles.tdDay}>{new Date(l.startDate).toLocaleDateString()}</td>
                  <td style={styles.tdDay}>{new Date(l.endDate).toLocaleDateString()}</td>
                  <td style={styles.tdName}>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 2 & 3: Holidays from backend */}
      <div style={styles.flexRow}>
        <div className="card" style={{ flex: 1, padding: "0" }}>
          <div style={{ padding: "15px", background: "#2ecc71", color: "white", borderRadius: "8px 8px 0 0" }}>
            <h3 style={{ margin: 0 }}>📅 Upcoming Holidays</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {holidays.filter((h) => new Date(h.date) >= new Date()).map((h) => (
                <tr key={h._id}>
                  <td style={styles.tdDate}>{new Date(h.date).toLocaleDateString()}</td>
                  <td style={styles.tdDay}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                  <td style={styles.tdName}>{h.name}</td>
                </tr>
              ))}
              {holidays.filter((h) => new Date(h.date) >= new Date()).length === 0 && <tr><td colSpan={3} style={{ padding: 12, color: 'gray' }}>No upcoming holidays in database.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card" style={{ flex: 1, padding: "0", opacity: "0.8" }}>
          <div style={{ padding: "15px", background: "#95a5a6", color: "white", borderRadius: "8px 8px 0 0" }}>
            <h3 style={{ margin: 0 }}>⏮️ Past Holidays</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {holidays.filter((h) => new Date(h.date) < new Date()).slice(-5).reverse().map((h) => (
                <tr key={h._id}>
                  <td style={styles.tdDate}>{new Date(h.date).toLocaleDateString()}</td>
                  <td style={styles.tdDay}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                  <td style={styles.tdName}>{h.name}</td>
                </tr>
              ))}
              {holidays.filter((h) => new Date(h.date) < new Date()).length === 0 && <tr><td colSpan={3} style={{ padding: 12, color: 'gray' }}>No past holidays.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Whiteboard for user to plan their holidays */}
      <RemarksBoard pageName="Holiday Planner" />
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#2c3e50",
    fontSize: "14px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  flexRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap" // Responsive for mobile
  },
  // Table Cell Styles
  tdDate: { padding: "12px", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#555" },
  tdDay: { padding: "12px", borderBottom: "1px solid #eee", color: "gray" },
  tdName: { padding: "12px", borderBottom: "1px solid #eee", color: "#333" }
};

export default Holiday;