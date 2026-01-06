import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div className="container">
      <h1>Welcome to SyncFlow Dashboard</h1>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
    </div>
  );
};

export default Dashboard;