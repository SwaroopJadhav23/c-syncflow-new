import React, { useState } from 'react';
import RemarksBoard from '../components/remarksboard';

const Notice = () => {
  // State for active tab (Optional UI enhancement, but we will show all blocks for clarity)
  // Data for the sections
  const notices = [
    { id: 1, title: "⚠️ System Maintenance", date: "Dec 20, 2025", content: "The SyncFlow server will be down for maintenance from 2:00 AM to 4:00 AM." },
    { id: 2, title: "🎄 Annual Christmas Party", date: "Dec 24, 2025", content: "Join us at the main hall at 5:00 PM for gifts and dinner!" }
  ];

  const companyPolicies = [
    { title: "Remote Work Policy", content: "Employees are allowed 2 days of remote work per week with manager approval." },
    { title: "Code of Conduct", content: "Respect and inclusivity are mandatory. Zero tolerance for harassment." },
    { title: "Work Hours", content: "Standard hours are 9:00 AM to 6:00 PM (Mon-Fri)." }
  ];

  const privacyPolicies = [
    { title: "Data Protection", content: "All employee data is encrypted. We do not share personal details with third parties." },
    { title: "Device Monitoring", content: "Official laptops are monitored for security purposes during work hours." }
  ];

  const faqs = [
    { q: "How do I claim reimbursement?", a: "Go to Profile > Payments and upload your transaction receipt." },
    { q: "Who do I contact for IT support?", a: "Email support@syncflow.com or raise a ticket in the dashboard." },
    { q: "Can I change my shift timings?", a: "Shift changes require approval from the HR department and your Team Lead." }
  ];

  return (
    <div>
      <h2>📢 Information Center</h2>
      <p style={{ color: "gray", marginBottom: "20px" }}>Official updates, policies, and frequently asked questions.</p>

      {/* 1. OFFICIAL NOTICES SECTION */}
      <h3 style={styles.sectionHeader}>📌 Official Notices</h3>
      <div style={styles.gridContainer}>
        {notices.map((notice) => (
          <div key={notice.id} className="card" style={styles.noticeCard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#c0392b" }}>{notice.title}</h4>
              <small style={{ color: "gray" }}>{notice.date}</small>
            </div>
            <p style={{ fontSize: "14px", margin: 0 }}>{notice.content}</p>
          </div>
        ))}
      </div>

      <div style={styles.rowContainer}>
        
        {/* 2. COMPANY POLICIES SECTION */}
        <div style={{ flex: 1 }}>
          <h3 style={styles.sectionHeader}>⚖️ Company Policies</h3>
          <div className="card" style={{ height: "100%" }}>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {companyPolicies.map((policy, index) => (
                <li key={index} style={{ marginBottom: "15px" }}>
                  <strong>{policy.title}:</strong>
                  <p style={{ margin: "5px 0", fontSize: "13px", color: "#555" }}>{policy.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. PRIVACY POLICIES SECTION */}
        <div style={{ flex: 1 }}>
          <h3 style={styles.sectionHeader}>🔒 Privacy & Security</h3>
          <div className="card" style={{ height: "100%", borderTop: "4px solid #27ae60" }}>
            {privacyPolicies.map((policy, index) => (
              <div key={index} style={{ marginBottom: "15px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                <strong style={{ color: "#27ae60" }}>{policy.title}</strong>
                <p style={{ margin: "5px 0", fontSize: "13px", color: "#555" }}>{policy.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. FAQ SECTION */}
      <h3 style={styles.sectionHeader}>❓ Frequently Asked Questions (FAQ)</h3>
      <div className="card" style={{ marginBottom: "30px" }}>
        {faqs.map((faq, index) => (
          <details key={index} style={styles.faqDetails}>
            <summary style={styles.faqSummary}>{faq.q}</summary>
            <p style={styles.faqAnswer}>{faq.a}</p>
          </details>
        ))}
      </div>

      {/* Whiteboard for taking notes on policies */}
      <RemarksBoard pageName="Notice Board" />
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  sectionHeader: {
    borderBottom: "2px solid #ecf0f1",
    paddingBottom: "10px",
    marginTop: "30px",
    marginBottom: "15px",
    color: "#2c3e50"
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px"
  },
  noticeCard: {
    borderLeft: "5px solid #c0392b", // Red accent for notices
    textAlign: "left"
  },
  rowContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap", // Makes it stack on mobile
    marginBottom: "20px"
  },
  // FAQ Styles
  faqDetails: {
    marginBottom: "10px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    textAlign: "left"
  },
  faqSummary: {
    cursor: "pointer",
    fontWeight: "bold",
    color: "#2980b9",
    outline: "none"
  },
  faqAnswer: {
    marginTop: "5px",
    color: "#555",
    fontSize: "14px",
    paddingLeft: "15px"
  }
};

export default Notice;