import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      alert(err.response.data.msg);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setStep(3); // Move to password reset
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully! Login with new password.'); // The pop up you requested
      navigate('/login');
    } catch (err) {
      alert('Error resetting password');
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      
      {step === 1 && (
        <form onSubmit={sendOtp}>
          <p>Enter your Email ID to receive OTP</p>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <p>Enter OTP sent to {email}</p>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword}>
          <p>Create New Password</p>
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;