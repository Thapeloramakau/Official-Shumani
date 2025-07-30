import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import AddStudents from "./addStudent-admin"
import "./admin.css";

export default function AddPaymentAdmin() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    client_name: "",
    amount_paid: "",

    payment_date: "",
    reference: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch payments
  // const fetchPayments = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("payments")
  //       .select("*")
  //       .order("payment_date", { ascending: false });

  //     if (error) throw error;
  //     setPayments(data);
  //   } catch (error) {
  //     console.error("Error fetching payments:", error);
  //   }
  // };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) throw error;

      console.log("Payments data:", data); // Check here
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };


  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit - Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing payment
      try {
        const { error } = await supabase
          .from("payments")
          .update(form)
          .eq("id", editingId);

        if (error) throw error;

        setEditingId(null);
        setForm({
          client_name: "",
          amount_paid: "",
          reference: "",
          payment_date: "",
        });
        fetchPayments();
      } catch (error) {
        console.error("Update failed:", error);
      }
    } else {
      // Add new payment
      try {
        const { error } = await supabase.from("payments").insert([form]);
        if (error) throw error;

        setForm({
          client_name: "",
          amount_paid: "",
          reference: "",
          payment_date: "",
        });
        fetchPayments();
      } catch (error) {
        console.error("Insert failed:", error);
      }
    }
  };

  // Edit button handler
  const handleEdit = (payment) => {
    setForm({
      client_name: payment.client_name,
      amount_paid: payment.amount_paid,
      reference: payment.reference,
      payment_date: payment.payment_date
        ? payment.payment_date.split("T")[0]
        : "",
    });
    setEditingId(payment.id);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      client_name: "",
      amount_paid: "",
      reference: "",
      payment_date: "",
    });
  };

  // Delete button handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        const { error } = await supabase.from("payments").delete().eq("id", id);
        if (error) throw error;
        fetchPayments();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Admin Payments</h1>

      {/* Add / Edit Payment Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="client_name"
          placeholder="Client Name"
          value={form.client_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount_paid"
          placeholder="Amount Paid"
          value={form.amount_paid}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reference"
          placeholder="Reference"
          value={form.reference}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="payment_date"
          value={form.payment_date}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Payment" : "Add Payment"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Payments Table */}
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Amount Paid</th>
            <th>Reference</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.client_name}</td>
              <td>R {p.amount_paid}</td>
              <td>{p.reference}</td>
              <td>{new Date(p.payment_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ marginLeft: "8px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
