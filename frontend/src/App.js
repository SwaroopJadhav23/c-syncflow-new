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

// Import CSS
import './App.css';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

// --- LAYOUT COMPONENT ---
const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; 
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    // We removed style={{ display: 'flex' }} because .dashboard-container in App.css handles it
    <div className="dashboard-container">
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* SIDEBAR */}
      {/* Removed inline styles. The .sidebar class in App.css makes it Dark Blue & Fixed Width */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">SyncFlow</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard/home" onClick={closeMobileMenu}>🏠 Home</Link>
          <Link to="/dashboard/profile" onClick={closeMobileMenu}>👤 Profile</Link>
          <Link to="/dashboard/timesheet" onClick={closeMobileMenu}>📅 Timesheet</Link>
          <Link to="/dashboard/notice" onClick={closeMobileMenu}>📢 Notice</Link>
          <Link to="/dashboard/holiday" onClick={closeMobileMenu}>🎉 Holiday</Link>
          <Link to="/dashboard/meeting" onClick={closeMobileMenu}>🤝 Meeting</Link>
          <Link to="/dashboard/remarks" onClick={closeMobileMenu}>📝 Remarks</Link>
          
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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="notice" element={<Notice />} />
          <Route path="holiday" element={<Holiday />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="remarks" element={<RemarksBoard />} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;