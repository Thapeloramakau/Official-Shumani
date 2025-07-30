import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import FeesStatementDocument from "./feesStatement";

const ClientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paidTotal, setPaidTotal] = useState(0);
  const [outstanding, setOutstanding] = useState(2000);
  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) throw error;

      setPayments(data);

      const total = data.reduce((sum, p) => sum + Number(p.amount_paid), 0);
      setPaidTotal(total);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const statementData = {
    companyName: "Shumani Solutions Pty Ltd",
    studentNumber: "12345", // or from your data source
    transactions: payments.map((p) => ({
      date: new Date(p.payment_date).toLocaleDateString(),
      reference: p.reference || "No Ref",
      description: p.description || "Payment",
      debit: 0, // you might want to adapt this depending on your data structure
      credit: Number(p.amount_paid),
    })),
  };

  const handleView = async () => {
    const blob = await pdf(
      <FeesStatementDocument statementData={statementData} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // open PDF in new tab
  };

  const handleDownload = async () => {
    const blob = await pdf(
      <FeesStatementDocument statementData={statementData} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Shumani fees-statement.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  // const handleView = async () => {
  //   const blob = await pdf(<FeesStatementDocument statementData={statementData} />).toBlob();
  //   const url = URL.createObjectURL(blob);
  //   window.open(url, "_blank");
  // };

  // const handleDownload = async () => {
  //   const statementData = {
  //     companyName: "Shumani Solutions Pty Ltd",
  //     studentNumber: "ABC123",
  //     transactions: payments.map((p) => ({
  //       date: new Date(p.payment_date).toLocaleDateString(),
  //       reference: p.reference || "N/A",
  //       description: p.description || "Payment",
  //       debit: 0,
  //       credit: parseFloat(p.amount_paid),
  //     })),
  //   };

  //   const blob = await pdf(
  //     <FeesStatementDocument statementData={statementData} />
  //   ).toBlob();

  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "fees-statement.pdf";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const pieData = [
    { name: "Paid", value: paidTotal },
    { name: "Outstanding", value: outstanding },
  ];

  const COLORS = ["#38bdf8", "#f43f5e"];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Balance Card */}
      <div
        style={{
          margin: "0 auto",
          width: "fit-content",
          background: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem", color: "#333" }}>
          Outstanding Balance
        </h2>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f43f5e" }}>
          R {outstanding.toLocaleString()}
        </p>

        <div style={{ position: "relative", marginTop: "2rem" }}>
          <PieChart width={250} height={250}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "#666" }}>Paid</p>
            <h3 style={{ margin: 0, color: "#38bdf8" }}>
              R {paidTotal.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Payment History Card */}
      <div
        style={{
          marginTop: "2rem",
          background: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#333" }}>Payment History</h2>

        {payments.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "#f9f9f9",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                {item.reference || "No Ref"}
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                {new Date(item.payment_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#22c55e" }}>
                R {Number(item.amount_paid).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={handleView}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          View Statement
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Download Statement
        </button>

        {/* <button
          style={{
            padding: "0.75rem 1.5rem",
            background: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Upload Proof of Payment
        </button> */}
      </div>
    </div>
  );
};

export default ClientPayments;
