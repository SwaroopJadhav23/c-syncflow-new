import React, { useState, useEffect } from 'react';
import RemarksBoard from '../components/remarksboard';

const Profile = () => {
  // Initial State
  const [profileData, setProfileData] = useState({
    name: "", 
    email: "",
    phone: "",
    qualification: "",
    institute: "",
    address: "",
    trainingMode: "Full Time",
    paymentAmount: "",
    paymentMode: "Bank Transfer",
    transactionNo: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  // --- 1. LOAD DATA FROM LOCAL STORAGE ON STARTUP ---
  useEffect(() => {
    // Get the user data saved during Login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setProfileData((prevData) => ({
        ...prevData,
        name: parsedUser.username || "", // Load Name from Login
        email: parsedUser.email || ""    // Load Email from Login
      }));
    }
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // --- 2. SAVE NEW NAME TO LOCAL STORAGE ---
  const handleSave = (e) => {
    e.preventDefault();

    // A. Update LocalStorage so Dashboard sees the change
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { 
      ...storedUser, 
      username: profileData.name, // UPDATE THE NAME
      email: profileData.email    // UPDATE THE EMAIL
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // B. (Optional) Here you would also send axios.put() to update MongoDB

    alert("Profile Details Saved Successfully!");
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{color: '#1e293b'}}>👤 User Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          style={isEditing ? styles.cancelBtn : styles.editBtn}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Form Card */}
      <div style={styles.card}>
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

            {/* Training Mode */}
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

            {/* Payment Mode */}
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
                style={{ ...styles.input, height: '60px', resize: 'none' }}
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
      <div style={styles.whiteboardContainer}>
        <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>📝 Profile Remarks</h3>
        <RemarksBoard pageName="Profile Page" />
      </div>
    </div>
  );
};

// --- CSS Styles Object ---
const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    marginBottom: "30px",
    textAlign: 'left'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive cols
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#34495e',
    fontSize: '14px'
  },
  input: {
    padding: '12px',
    border: '1px solid #dfe6e9',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f8f9fa',
    width: '100%',
    transition: 'border 0.3s'
  },
  editBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  saveBtn: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  whiteboardContainer: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  }
};

export default Profile;