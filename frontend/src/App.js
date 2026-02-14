import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';

// --- COMPONENTS ---
import Register from './components/register';
import Login from './components/login';
import ForgotPassword from './components/forgotpassword';
import RemarksBoard from './components/remarksboard';
import TestTask from './components/testtask'; 

// --- PAGES ---
import DashboardHome from './pages/dashboardhome'; 
import Profile from './pages/profile';
import Timesheet from './pages/timesheet';
import Notice from './pages/notice';
import Holiday from './pages/holidays';
import Meeting from './pages/meetings';
import Admin from './pages/admin';

// Import CSS
import './App.css';

// --- LAYOUT COMPONENT ---
const DashboardLayout = () => {
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; 
  };

  return (
    // We removed style={{ display: 'flex' }} because .dashboard-container in App.css handles it
    <div className="dashboard-container">
      
      {/* SIDEBAR */}
      {/* Removed inline styles. The .sidebar class in App.css makes it Dark Blue & Fixed Width */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">SyncFlow</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard/home">🏠 Home</Link>
          <Link to="/dashboard/profile">👤 Profile</Link>
          <Link to="/dashboard/timesheet">📅 Timesheet</Link>
          <Link to="/dashboard/notice">📢 Notice</Link>
          <Link to="/dashboard/holiday">🎉 Holiday</Link>
          <Link to="/dashboard/meeting">🤝 Meeting</Link>
          <Link to="/dashboard/remarks">📝 Remarks</Link>
          {parsedUser && parsedUser.role === 'admin' && (
            <Link to="/dashboard/admin">🔧 Admin</Link>
          )}
          
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        {/* content-wrapper gives the white card effect defined in App.css */}
        <div className="content-wrapper">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

// --- 404 COMPONENT ---
const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>404</h1>
    <p>Page not found</p>
    <Link to="/login">Go to Login</Link>
  </div>
);

function App() {
  return (
    <Router>
      
      {/* Database Test Button (Commented out for now so it doesn't block UI) */}
      {/* <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
        <TestTask />
      </div> */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="notice" element={<Notice />} />
          <Route path="holiday" element={<Holiday />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="remarks" element={<RemarksBoard />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;