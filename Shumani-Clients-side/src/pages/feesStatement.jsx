// src/components/FeesStatementDocument.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";



import logo from "../images/SHUMANI LOGO.jpg"; 

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoSection: {
    width: "50%",
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 5,
  },
  contactInfo: {
    textAlign: "right",
    fontSize: 10,
  },
  companyInfo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    paddingBottom: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: "0.5px solid #ccc",
  },
  cell: {
    flex: 1,
  },
  bankCard: {
    marginTop: 20,
    padding: 10,
    border: "1px solid #000",
  },
  summarySection: {
    marginTop: 15,
    padding: 10,
    border: "1px solid #000",
    backgroundColor: "#f0f0f0",
  },
  summaryText: {
    marginBottom: 3,
  },
});

const FeesStatementDocument = ({ statementData }) => {
  const totalDebit = statementData?.transactions.reduce(
    (sum, t) => sum + parseFloat(t.debit || 0),
    0
  );
  const totalCredit = statementData?.transactions.reduce(
    (sum, t) => sum + parseFloat(t.credit || 0),
    0
  );
  const outstanding = totalDebit - totalCredit;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src={logo} style={styles.logo} />
            <Text>Shumani Solutions Pty Ltd</Text>
            <Text>123 Address Street</Text>
            <Text>Tel: 012 345 6789</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
            <Text>Email: info@shumani.co.za</Text>
            <Text>Website: www.shumani.co.za</Text>
          </View>
        </View>

        {/* Company + Student Info */}
        <View style={styles.companyInfo}>
          <Text>Company Name: {statementData?.companyName}</Text>
          <Text>Reference / Student No: {statementData?.studentNumber}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Fees Statement</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Reference</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Debit</Text>
          <Text style={styles.cell}>Credit</Text>
        </View>

        {/* Transactions */}
        {statementData?.transactions?.map((tx, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.cell}>{tx.date}</Text>
            <Text style={styles.cell}>{tx.reference}</Text>
            <Text style={styles.cell}>{tx.description}</Text>
            <Text style={styles.cell}>{tx.debit}</Text>
            <Text style={styles.cell}>{tx.credit}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.tableRow}>
          <Text style={styles.cell}>Total</Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>{totalDebit.toFixed(2)}</Text>
          <Text style={styles.cell}>{totalCredit.toFixed(2)}</Text>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>
            Total Debit: R {totalDebit.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            Total Credit: R {totalCredit.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            <Text style={{ fontWeight: "bold" }}>
              Outstanding Balance: R {outstanding.toFixed(2)}
            </Text>
          </Text>
        </View>

        {/* Banking Details */}
        <View style={styles.bankCard}>
          <Text>Banking Details:</Text>
          <Text>Bank: Capitec</Text>
          <Text>Account Name: Shumani Solutions Pty Ltd</Text>
          <Text>Account Number: 1234567890</Text>
          <Text>Branch Code: 470010</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FeesStatementDocument;
