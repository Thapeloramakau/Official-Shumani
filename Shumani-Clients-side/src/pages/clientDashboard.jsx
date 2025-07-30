import React from "react";
import { FaBell } from "react-icons/fa";
import "./dashboard.css";

const notifications = [
  { id: 1, text: "Payment #001234 received.", date: "2025-07-20" },
  { id: 2, text: "New course material available.", date: "2025-07-18" },
  { id: 3, text: "Invoice #INV-789 due soon.", date: "2025-07-25" },
];

const upcomingDeadlines = [
  { id: 1, event: "Fee payment due", date: "2025-07-26" },
  { id: 2, event: "Course completion deadline", date: "2025-08-10" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, Martin 👋</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div className="dashboard-bell">
            <FaBell size={24} color="#0d9488" />
            <span className="bell-badge">{notifications.length}</span>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="profile-image"
          />
        </div>
      </header>

      {/* Notifications */}
      <section style={{ marginBottom: 40 }}>
        <h2 className="section-heading">🔔 Recent Notifications</h2>
        <div className="card-box">
          {notifications.map((note) => (
            <div key={note.id} className="card-item">
              <p>{note.text}</p>
              <small className="card-date">
                {new Date(note.date).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </section>

      {/* Deadlines */}
      <section>
        <h2 className="section-heading">📅 Upcoming Deadlines</h2>
        <div className="card-box">
          {upcomingDeadlines.map((item) => (
            <div key={item.id} className="card-item">
              <p>{item.event}</p>
              <small className="card-date">
                {new Date(item.date).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
