import React, { useState } from 'react';
import RemarksBoard from '../components/remarksboard';

const Profile = () => {
  // State to hold the profile data
  const [profileData, setProfileData] = useState({
    name: "John Doe", 
    email: "john@syncflow.com",
    phone: "",
    qualification: "",
    institute: "",
    address: "",
    trainingMode: "Select training mode", // Default value updated
    paymentAmount: "",
    paymentMode: "Select payment mode", // New field for Payment Mode
    transactionNo: ""
  });

  const [isEditing, setIsEditing] = useState(true); // Control if form is editable

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle Save (Simulated)
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved Data:", profileData);
    alert("Profile Details Saved Successfully!");
    setIsEditing(false); // Switch to "View Mode" after saving
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👤 User Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          style={isEditing ? styles.cancelBtn : styles.editBtn}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      <div className="card" style={{ textAlign: 'left', marginBottom: '30px' }}>
        <form onSubmit={handleSave}>
          <div style={styles.gridContainer}>
            
            {/* Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input 
                type="text" 
                name="name" 
                value={profileData.name} 
                onChange={handleChange} 
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={profileData.email} 
                onChange={handleChange} 
                style={styles.input}
                disabled={!isEditing} 
              />
            </div>

            {/* Phone No */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone No:</label>
              <input 
                type="tel" 
                name="phone" 
                value={profileData.phone} 
                onChange={handleChange} 
                placeholder="+91 98765 43210"
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Qualification */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Qualification:</label>
              <input 
                type="text" 
                name="qualification" 
                value={profileData.qualification} 
                onChange={handleChange} 
                placeholder="e.g. B.Tech CSE"
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Institute Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Institute Name:</label>
              <input 
                type="text" 
                name="institute" 
                value={profileData.institute} 
                onChange={handleChange} 
                placeholder="University / College Name"
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Training Mode (Updated Options) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Training Mode:</label>
              <select 
                name="trainingMode" 
                value={profileData.trainingMode} 
                onChange={handleChange} 
                style={styles.input}
                disabled={!isEditing}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On Site">On Site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Payment Amount */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Amount (Rs):</label>
              <input 
                type="number" 
                name="paymentAmount" 
                value={profileData.paymentAmount} 
                onChange={handleChange} 
                placeholder="e.g. 5000"
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Payment Mode (New Field) */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Mode:</label>
              <select 
                name="paymentMode" 
                value={profileData.paymentMode} 
                onChange={handleChange} 
                style={styles.input}
                disabled={!isEditing}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
              </select>
            </div>

            {/* Transaction No */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Transaction No:</label>
              <input 
                type="text" 
                name="transactionNo" 
                value={profileData.transactionNo} 
                onChange={handleChange} 
                placeholder="UPI Ref / Cheque No"
                style={styles.input}
                disabled={!isEditing}
              />
            </div>

            {/* Address (Full Width) */}
            <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
              <label style={styles.label}>Address:</label>
              <textarea 
                name="address" 
                value={profileData.address} 
                onChange={handleChange} 
                placeholder="Full Residential Address"
                style={{ ...styles.input, height: '60px' }}
                disabled={!isEditing}
              />
            </div>

          </div>

          {/* Save Button */}
          {isEditing && (
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button type="submit" style={styles.saveBtn}>Save Details</button>
            </div>
          )}
        </form>
      </div>

      {/* Whiteboard Component at the bottom */}
      <RemarksBoard pageName="Profile Page" />
    </div>
  );
};

// --- CSS Styles Object ---
const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two columns layout
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2c3e50',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: '#fff',
    width: '100%', // Ensure selects take full width
    boxSizing: 'border-box'
  },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default Profile;