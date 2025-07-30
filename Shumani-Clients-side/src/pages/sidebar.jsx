import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaFileInvoice,
  FaChartPie,
  FaEnvelope,
  FaCertificate,
  FaUserShield,
} from "react-icons/fa";
import "./sidebar.css";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <h2 className="logo">{expanded ? "Dashboard" : "📊"}</h2>
      <nav>
        <Link to="/" className="sidebar-link">
          <FaChartPie className="icon" />
          {expanded && <span>Dashboard</span>}
        </Link>

        <Link to="/students" className="sidebar-link">
          <FaUserGraduate className="icon" />
          {expanded && <span>Students</span>}
        </Link>

        <Link to="/invoices" className="sidebar-link">
          <FaFileInvoice className="icon" />
          {expanded && <span>Invoices</span>}
        </Link>

        <Link to="/reports" className="sidebar-link">
          <FaChartPie className="icon" />
          {expanded && <span>Reports</span>}
        </Link>

        <Link to="/messages" className="sidebar-link">
          <FaEnvelope className="icon" />
          {expanded && <span>Messages</span>}
        </Link>

        <Link to="/certificates" className="sidebar-link">
          <FaCertificate className="icon" />
          {expanded && <span>Certificates</span>}
        </Link>

        <Link to="/addPayment-Admin" className="sidebar-link">
          <FaUserShield className="icon" />
          {expanded && <span>Admin</span>}
        </Link>
        <Link to="/addStudent-Admin" className="sidebar-link">
          <FaUserShield className="icon" />
          {expanded && <span>Add Student</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
