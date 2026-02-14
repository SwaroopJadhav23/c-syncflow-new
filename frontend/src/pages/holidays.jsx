import React, { useState } from 'react';
import RemarksBoard from '../components/remarksboard';

const Holiday = () => {
  // 1. STATE: Leave Request Form
  const [leaveForm, setLeaveForm] = useState({
    type: "Sick Leave", // Default selection
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    alert(`Leave Request Sent!\nType: ${leaveForm.type}\nFrom: ${leaveForm.startDate} To: ${leaveForm.endDate}`);
    // Reset form after submission
    setLeaveForm({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
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
            <button type="submit" style={styles.submitBtn}>Submit Request</button>
          </div>
        </form>
      </div>

      {/* SECTION 2: UPCOMING HOLIDAYS */}
      <div style={styles.flexRow}>
        <div className="card" style={{ flex: 1, padding: "0" }}>
          <div style={{ padding: "15px", background: "#2ecc71", color: "white", borderRadius: "8px 8px 0 0" }}>
            <h3 style={{ margin: 0 }}>📅 Upcoming Holidays</h3>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {/* Upcoming Date 1 */}
              <tr>
                <td style={styles.tdDate}>25 Dec 2025</td>
                <td style={styles.tdDay}>Thursday</td>
                <td style={styles.tdName}>Christmas Day</td>
              </tr>
              {/* Upcoming Date 2 */}
              <tr>
                <td style={styles.tdDate}>01 Jan 2026</td>
                <td style={styles.tdDay}>Thursday</td>
                <td style={styles.tdName}>New Year's Day</td>
              </tr>
              {/* Upcoming Date 3 */}
              <tr>
                <td style={styles.tdDate}>26 Jan 2026</td>
                <td style={styles.tdDay}>Monday</td>
                <td style={styles.tdName}>Republic Day</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: PAST HOLIDAYS */}
        <div className="card" style={{ flex: 1, padding: "0", opacity: "0.8" }}>
          <div style={{ padding: "15px", background: "#95a5a6", color: "white", borderRadius: "8px 8px 0 0" }}>
            <h3 style={{ margin: 0 }}>⏮️ Past Holidays (2025)</h3>
          </div>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={styles.tdDate}>15 Aug 2025</td>
                <td style={styles.tdDay}>Friday</td>
                <td style={styles.tdName}>Independence Day</td>
              </tr>
              <tr>
                <td style={styles.tdDate}>02 Oct 2025</td>
                <td style={styles.tdDay}>Thursday</td>
                <td style={styles.tdName}>Gandhi Jayanti</td>
              </tr>
              <tr>
                <td style={styles.tdDate}>20 Oct 2025</td>
                <td style={styles.tdDay}>Monday</td>
                <td style={styles.tdName}>Diwali</td>
              </tr>
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