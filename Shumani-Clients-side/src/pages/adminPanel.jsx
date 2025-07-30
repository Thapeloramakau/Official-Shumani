import React from "react";
import AddPaymentForm from "../admin/addPayment-admin";

function AdminPanel() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AddPaymentForm />
      {/* Later: export reports, filter by course, etc. */}
    </div>
  );
}

export default AdminPanel;
