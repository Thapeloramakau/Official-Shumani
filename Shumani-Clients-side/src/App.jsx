import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "./pages/students";
import ClientPayments from "./pages/paymentHistory";
import Reports from "./pages/reports";
import Notifications from "./pages/messages";
import Certification from "./pages/certification";
import Sidebar from "./pages/sidebar";
import Dashboard from "./pages/clientDashboard";
import AddPaymentAdmin from "./admin/addPayment-admin";
import AddStudents from "./admin/addStudent-admin";
import Statement from "./pages/feesStatement"; 
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/invoices" element={<ClientPayments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Notifications />} />
            <Route path="/certificates" element={<Certification />} />
            <Route path="/addPayment-admin" element={<AddPaymentAdmin />} />
            <Route path="/addStudent-admin" element={<AddStudents />} />
            <Route path="/statement" element={<Statement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
