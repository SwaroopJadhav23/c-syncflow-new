import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
// Components
import Register from './components/register';
import Login from './components/login';
import ForgotPassword from './components/forgotpassword';
// Pages
import DashboardHome from './pages/dashboardhome';
import Profile from './pages/profile';
import Timesheet from './pages/timesheet';
import Notice from './pages/notice';
import Holiday from './pages/holidays';
import Meeting from './pages/meetings';
import './App.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">SyncFlow</h2>
        <nav>
          <Link to="/dashboard/home">🏠 Home</Link>
          <Link to="/dashboard/profile">👤 Profile</Link>
          <Link to="/dashboard/timesheet">📅 Timesheet</Link>
          <Link to="/dashboard/notice">📢 Notice</Link>
          <Link to="/dashboard/holiday">🎉 Holiday</Link>
          <Link to="/dashboard/meeting">🤝 Meeting</Link>
          <Link to="/login" style={{ marginTop: "auto", color: "#e74c3c" }} onClick={() => localStorage.removeItem('token')}>🚪 Logout</Link>
        </nav>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="notice" element={<Notice />} />
          <Route path="holiday" element={<Holiday />} />
          <Route path="meeting" element={<Meeting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;