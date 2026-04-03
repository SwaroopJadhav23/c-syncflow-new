import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaLock, FaBriefcase, FaIdBadge } from 'react-icons/fa'; // Temporarily disabled

// Inline SVG icons as fallback
const FaUser = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  </svg>
);

const FaEnvelope = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
  </svg>
);

const FaLock = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
  </svg>
);

const FaBriefcase = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M6.5 1A3.5 3.5 0 0 0 3 4.5V7.5H1.5A1.5 1.5 0 0 0 0 9v5a1.5 1.5 0 0 0 1.5 1.5H13a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5H11V4.5A3.5 3.5 0 0 0 7.5 1h-1zm0 1h1a2.5 2.5 0 0 1 2.5 2.5V7.5H4V4.5A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const FaIdBadge = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v1H1V4a1 1 0 0 1 1-1h12zm1 3v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6h14zm-8.5 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
);
import '../App.css'; // Import the CSS styles

const Register = () => {
  const navigate = useNavigate();
  
  // 1. State keys must match your Backend User Model exactly
  const [formData, setFormData] = useState({ 
    username: '',   // Backend expects 'username', not 'name'
    employeeId: '', // Backend expects 'employeeId', not 'customId'
    email: '', 
    password: '', 
    role: 'employee' 
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 2. Send data to Backend
      const res = await axios.post('https://c-syncflow-mxgm.onrender.com/api/auth/register', formData);
      
      // Success
      alert(res.data.msg || "Registration Successful!");
      navigate('/login');
    } catch (err) {
      // Error Handling
      console.error("Register Error:", err);
      const errorMsg = err.response?.data?.msg || 'Registration failed. Check connection.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side: Visual */}
        <div className="auth-visual">
          <div className="visual-content">
            <h1>SyncFlow</h1>
            <p>Intelligent Real-Time Project Management</p>
            <div className="visual-decoration"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join your team and start syncing.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="input-group">
              <span className="input-icon"><FaUser /></span>
              <input 
                type="text" 
                name="username" // Matches state key
                placeholder="Full Name" 
                value={formData.username}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Employee ID */}
            <div className="input-group">
              <span className="input-icon"><FaIdBadge /></span>
              <input 
                type="text" 
                name="employeeId" // Matches state key
                placeholder="Employee ID (e.g. EMP01)" 
                value={formData.employeeId}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <span className="input-icon"><FaEnvelope /></span>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <span className="input-icon"><FaLock /></span>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Role Selection */}
            <div className="input-group">
              <span className="input-icon"><FaBriefcase /></span>
              <select 
                name="role" 
                onChange={handleChange} 
                value={formData.role}
              >
                <option value="employee">Employee</option>
                <option value="intern">Intern</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;