import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const API = 'http://localhost:5000/api/auth';

const Profile = () => {
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
  const [loading, setLoading] = useState(true);

  // Load from backend; fallback to localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const u = res.data;
          setProfileData({
            name: u.username || "",
            email: u.email || "",
            phone: u.phone || "",
            qualification: u.qualification || "",
            institute: u.institute || "",
            address: u.address || "",
            trainingMode: u.trainingMode || "Full Time",
            paymentAmount: u.paymentAmount || "",
            paymentMode: u.paymentMode || "Bank Transfer",
            transactionNo: u.transactionNo || ""
          });
        })
        .catch(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setProfileData((prev) => ({ ...prev, name: parsed.username || "", email: parsed.email || "" }));
          }
        })
        .finally(() => setLoading(false));
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfileData((prev) => ({ ...prev, name: parsed.username || "", email: parsed.email || "" }));
      }
      setLoading(false);
    }
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      username: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      qualification: profileData.qualification,
      institute: profileData.institute,
      address: profileData.address,
      trainingMode: profileData.trainingMode,
      paymentAmount: profileData.paymentAmount,
      paymentMode: profileData.paymentMode,
      transactionNo: profileData.transactionNo
    };
    if (token) {
      try {
        const res = await axios.put(`${API}/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
        const u = res.data;
        localStorage.setItem('user', JSON.stringify({
          id: u._id,
          username: u.username,
          email: u.email,
          role: u.role
        }));
        alert("Profile saved to server.");
      } catch (err) {
        alert(err.response?.data?.msg || "Failed to save profile.");
        return;
      }
    } else {
      const stored = JSON.parse(localStorage.getItem('user')) || {};
      stored.username = profileData.name;
      stored.email = profileData.email;
      localStorage.setItem('user', JSON.stringify(stored));
      alert("Profile saved locally (not logged in).");
    }
    setIsEditing(false);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading profile...</div>;

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