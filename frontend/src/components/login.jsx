import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Import Icons
import '../App.css'; // Ensure CSS is applied

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your API Call
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Save token and redirect
      localStorage.setItem('token', res.data.token);
      // Save user object so UI can be role-aware (admin/manager/etc.)
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      // Navigate to the dashboard home (not just /dashboard, to avoid blank outlet)
      navigate('/dashboard/home'); 
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Login Failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side: Visual/Branding */}
        <div className="auth-visual">
          <div className="visual-content">
            <h1>SyncFlow</h1>
            <p>Welcome back! Please login to manage your projects.</p>
          </div>
          <div className="visual-decoration"></div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <h2>Login</h2>
            <p>Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div className="input-group">
              <span className="input-icon">
                <FaEnvelope />
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <span className="input-icon">
                <FaLock />
              </span>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <Link to="/forgot-password" style={{ color: '#3498db', fontSize: '14px', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;