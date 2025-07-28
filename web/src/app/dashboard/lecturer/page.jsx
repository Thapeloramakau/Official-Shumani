"use client";
import React from "react";
import { useRouter } from "next/navigation";

const LecturerWelcomePage = () => {
  const router = useRouter();

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2rem",
    marginBottom: "10px",
    color: "#2c3e50",
  };

  const subheadingStyle = {
    fontSize: "1rem",
    marginBottom: "30px",
    color: "#7f8c8d",
  };

  const buttonStyle = {
    padding: "12px 20px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3498db",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s ease",
  };

  const handleHover = (e) => (e.target.style.backgroundColor = "#2980b9");
  const handleLeave = (e) => (e.target.style.backgroundColor = "#3498db");

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Welcome, Lecturer 👋</h1>
        <p style={subheadingStyle}>
          Choose one of the functions below to get started:
        </p>

        {[
          {
            label: "📚 View Assigned Modules",
            path: "/dashboard/lecturer/modules",
          },
          {
            label: "🧑‍🎓 View Enrolled Students",
            path: "/dashboard/lecturer/students",
          },
          {
            label: "📝 Upload Module Content",
            path: "/dashboard/lecturer/upload-content",
          },
          {
            label: "⚙️ Settings",
            path: "/dashboard/lecturer/settings",
          },
        ].map((btn, idx) => (
          <button
            key={idx}
            style={buttonStyle}
            onClick={() => router.push(btn.path)}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LecturerWelcomePage;
