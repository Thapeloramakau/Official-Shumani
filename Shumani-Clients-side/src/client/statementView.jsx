import React, { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StatementPage.css";

export default function StatementPage({ selectedStudent, studentInfo }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("student_id", selectedStudent);

      if (error) {
        console.error("Error fetching payments:", error.message);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    if (selectedStudent) {
      fetchPayments();
    }
  }, [selectedStudent]);

  const calculateTotals = () => {
    let debit = 0;
    let credit = 0;

    data.forEach((item) => {
      debit += parseFloat(item.debit || 0);
      credit += parseFloat(item.credit || 0);
    });

    return { debit, credit };
  };

  const { debit, credit } = calculateTotals();

  
  const handleView = () => {
    window.print();
  };

  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

   
    doc.setFontSize(16);
    doc.text("Shumani Solutions Pty Ltd", 14, 20);
    doc.setFontSize(12);
    doc.text(`Statement Date: ${currentDate}`, 14, 28);
    doc.text(`Company Name: ${studentInfo?.company_name || "N/A"}`, 14, 36);
    doc.text(
      `Reference / Student No: ${
        studentInfo?.student_number || selectedStudent
      }`,
      14,
      44
    );

    
    const tableColumn = ["Date", "Reference", "Description", "Debit", "Credit"];
    const tableRows = [];

    data.forEach((item) => {
      const row = [
        item.payment_date || "-",
        item.reference || "-",
        item.description || "-",
        item.debit ? `R${item.debit}` : "-",
        item.credit ? `R${item.credit}` : "-",
      ];
      tableRows.push(row);
    });

   
    tableRows.push([
      "",
      "",
      "Totals",
      `R${debit.toFixed(2)}`,
      `R${credit.toFixed(2)}`,
    ]);

   
    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
    });

   
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Banking Details:", 14, finalY);
    doc.text("Bank: ABSA Bank", 14, finalY + 8);
    doc.text("Account Name: Shumani Solutions Pty Ltd", 14, finalY + 16);
    doc.text("Account Number: 123456789", 14, finalY + 24);
    doc.text("Branch Code: 632005", 14, finalY + 32);
    doc.text("Reference: Your student number", 14, finalY + 40);

 
    doc.save(`Statement_${studentInfo?.student_number || selectedStudent}.pdf`);
  };

  return (
    <div className="statement-container">
      <div className="statement-header">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h2>Shumani Solutions (Pty) Ltd</h2>
          <p>123 Main Street, Johannesburg</p>
          <p>support@shumani.co.za | +27 11 123 4567</p>
        </div>
        <div className="date-section">
          <p>
            <strong>Statement Date:</strong> {currentDate}
          </p>
        </div>
      </div>

      <div className="info-section">
        <p>
          <strong>Company Name:</strong> {studentInfo?.company_name || "N/A"}
        </p>
        <p>
          <strong>Reference / Student No:</strong>{" "}
          {studentInfo?.student_number || selectedStudent}
        </p>
      </div>

      <div className="statement-buttons">
        <button onClick={handleView}>🧾 View Statement</button>
        <button onClick={handleDownloadPDF}>⬇️ Download PDF</button>
      </div>

      {loading ? (
        <p>Loading statement...</p>
      ) : data.length > 0 ? (
        <table className="statement-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.payment_date || "-"}</td>
                <td>{item.reference || "-"}</td>
                <td>{item.description || "-"}</td>
                <td>{item.debit ? `R${item.debit}` : "-"}</td>
                <td>{item.credit ? `R${item.credit}` : "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">
                <strong>Totals</strong>
              </td>
              <td>
                <strong>R{debit.toFixed(2)}</strong>
              </td>
              <td>
                <strong>R{credit.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p>No statement data available.</p>
      )}

      <div className="bank-card">
        <h3>Banking Details</h3>
        <p>
          <strong>Bank:</strong> ABSA Bank
        </p>
        <p>
          <strong>Account Name:</strong> Shumani Solutions Pty Ltd
        </p>
        <p>
          <strong>Account Number:</strong> 123456789
        </p>
        <p>
          <strong>Branch Code:</strong> 632005
        </p>
        <p>
          <strong>Reference:</strong> Your student number
        </p>
      </div>
    </div>
  );
}
