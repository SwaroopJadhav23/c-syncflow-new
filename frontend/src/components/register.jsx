import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, IdCard } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    customId: '', 
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
      // Sending request to the backend route we just created
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Show success message from backend
      alert(response.data.msg);
      navigate('/login');
    } catch (err) {
      // If the backend sends an error (like 400 or 500), show the message here
      const errorMsg = err.response?.data?.msg || 'Registration failed. Check if your backend server is running.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="visual-content">
            <h1>SyncFlow</h1>
            <p>Intelligent Real-Time Project Management</p>
            <div className="visual-decoration"></div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join your team and start syncing.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <IdCard className="input-icon" size={18} />
              <input type="text" name="customId" placeholder="Employee ID (e.g. EMP01)" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <Briefcase className="input-icon" size={18} />
              <select name="role" onChange={handleChange} value={formData.role}>
                <option value="employee">Employee</option>
                <option value="intern">Intern</option>
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