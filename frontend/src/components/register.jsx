import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBriefcase, FaIdBadge } from 'react-icons/fa'; // Standardized Icons
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
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Success
      alert(response.data.msg || "Registration Successful!");
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