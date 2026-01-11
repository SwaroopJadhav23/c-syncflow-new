import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import '../App.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('OTP sent! Check server console.');
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error sending OTP. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setStep(3); // Move to password reset
    } catch (err) {
      alert(err.response?.data?.msg || 'Invalid OTP. Please try again.');
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully! Login with new password.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error resetting password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side: Visual/Branding */}
        <div className="auth-visual">
          <div className="visual-content">
            <h1>SyncFlow</h1>
            <p>Reset your password to regain access to your account.</p>
          </div>
          <div className="visual-decoration"></div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <h2>Reset Password</h2>
            <p>
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={sendOtp}>
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
              <button type="submit" className="auth-btn">
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <div className="input-group">
                <span className="input-icon">
                  <FaKey />
                </span>
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                />
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                OTP sent to: <strong>{email}</strong>
              </p>
              <button type="submit" className="auth-btn">
                Verify OTP
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '10px',
                  background: 'transparent',
                  color: '#3498db',
                  border: '1px solid #3498db',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Back to Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetPassword}>
              <div className="input-group">
                <span className="input-icon">
                  <FaLock />
                </span>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  minLength={6}
                />
              </div>
              <button type="submit" className="auth-btn">
                Reset Password
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="auth-footer">
            <p>Remember your password? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;