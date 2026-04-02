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

  if (loading) return <div className="dashboard-page" style={{ padding: 20 }}>Loading profile...</div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">👤 User Profile</h2>
          <p className="page-subtitle">Manage your personal data & preferences</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={isEditing ? 'btn btn-danger' : 'btn btn-secondary'}
        >
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Form Card */}
      <div className="dashboard-card">
        <form onSubmit={handleSave}>
          <div className="grid-form">
            
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input 
                type="text" 
                name="name" 
                value={profileData.name} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email:</label>
              <input 
                type="email" 
                name="email" 
                value={profileData.email} 
                onChange={handleChange} 
                className="form-input"
                disabled={!isEditing} 
              />
            </div>

            {/* Phone No */}
            <div className="form-group">
              <label className="form-label">Phone No:</label>
              <input 
                type="tel" 
                name="phone" 
                value={profileData.phone} 
                onChange={handleChange} 
                placeholder="+91 98765 43210"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Qualification */}
            <div className="form-group">
              <label className="form-label">Qualification:</label>
              <input 
                type="text" 
                name="qualification" 
                value={profileData.qualification} 
                onChange={handleChange} 
                placeholder="e.g. B.Tech CSE"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Institute Name */}
            <div className="form-group">
              <label className="form-label">Institute Name:</label>
              <input 
                type="text" 
                name="institute" 
                value={profileData.institute} 
                onChange={handleChange} 
                placeholder="University / College Name"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Training Mode */}
            <div className="form-group">
              <label className="form-label">Training Mode:</label>
              <select 
                name="trainingMode" 
                value={profileData.trainingMode} 
                onChange={handleChange} 
                className="form-select"
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
            <div className="form-group">
              <label className="form-label">Payment Amount (Rs):</label>
              <input 
                type="number" 
                name="paymentAmount" 
                value={profileData.paymentAmount} 
                onChange={handleChange} 
                placeholder="e.g. 5000"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Payment Mode */}
            <div className="form-group">
              <label className="form-label">Payment Mode:</label>
              <select 
                name="paymentMode" 
                value={profileData.paymentMode} 
                onChange={handleChange} 
                className="form-select"
                disabled={!isEditing}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
              </select>
            </div>

            {/* Transaction No */}
            <div className="form-group">
              <label className="form-label">Transaction No:</label>
              <input 
                type="text" 
                name="transactionNo" 
                value={profileData.transactionNo} 
                onChange={handleChange} 
                placeholder="UPI Ref / Cheque No"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Address (Full Width) */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address:</label>
              <textarea 
                name="address" 
                value={profileData.address} 
                onChange={handleChange} 
                placeholder="Full Residential Address"
                className="form-input"
                style={{ height: '60px', resize: 'none' }}
                disabled={!isEditing}
              />
            </div>

          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="page-text-right" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">Save Details</button>
            </div>
          )}
        </form>
      </div>

      {/* Whiteboard Component at the bottom */}
      <div className="whiteboard-container">
        <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>📝 Profile Remarks</h3>
        <RemarksBoard pageName="Profile Page" />
      </div>
    </div>
  );
};

export default Profile;