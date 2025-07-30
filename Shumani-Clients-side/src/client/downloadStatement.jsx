// src/pages/DownloadStatement.js
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeesStatementDocument from "../pages/feesStatement";


const mockData = {
  companyName: "ABC Corp",
  studentNumber: "ST123456",
  transactions: [
    {
      date: "2025-07-01",
      reference: "INV001",
      description: "Tuition for July",
      debit: 2000,
      credit: 0,
    },
    {
      date: "2025-07-05",
      reference: "PAY001",
      description: "Payment",
      debit: 0,
      credit: 2000,
    },
  ],
};

const DownloadStatement = () => {
  return (
    <div style={{ padding: 30 }}>
      <h2>Download Fees Statement</h2>
      <PDFDownloadLink
        document={<FeesStatementDocument statementData={mockData} />}
        fileName="fees-statement.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Generating document..." : <button>Download PDF</button>
        }
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadStatement;
