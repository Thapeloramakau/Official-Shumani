"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/superbase"

const InvoiceContext = createContext(null)

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([])

  // Fetch invoices on load
  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase.from("invoices").select("*").order("issue_date", { ascending: false })
      if (error) {
        console.error("Error fetching invoices:", JSON.stringify(error, null, 2))
      } else {
        setInvoices(data)
      }
    }

    fetchInvoices()
  }, [])

  const refreshInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*").order("issue_date", { ascending: false })
    if (!error) setInvoices(data)
  }

  const getInvoices = () => invoices

  const getInvoiceById = (id) => invoices.find((invoice) => invoice.id === id)

  const getInvoicesByStatus = (status) => invoices.filter((invoice) => invoice.status === status)

  const addInvoice = async (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      issue_date: new Date().toISOString().split("T")[0],
      status: invoiceData.status || "draft",
      currency: invoiceData.currency || "ZAR",
    }

    const { data, error } = await supabase.from("invoices").insert([newInvoice])
    if (error) {
      console.error("Error adding invoice:", JSON.stringify(error, null, 2));
      return null
    }

    await refreshInvoices()
    return data[0]
  }

  const updateInvoice = async (id, updates) => {
  // Make sure your updates use the right column names like 'paid_date' not 'paidDate'
  const { error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating invoice:", JSON.stringify(error, null, 2));
  } else {
    console.log("Invoice updated successfully");
  }
};

  const deleteInvoice = async (id) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id)
    if (error) console.error("Error deleting invoice:", error)
    await refreshInvoices()
  }

  const markAsPaid = async (id, paymentMethod, paidDate = null) => {
    const actualPaidDate = paidDate || new Date().toISOString().split("T")[0]
    await updateInvoice(id, {
      status: "paid",
      paid_date: actualPaidDate,
      payment_method: paymentMethod,
    })
  }

  const markAsOverdue = async (id) => {
    await updateInvoice(id, { status: "overdue" })
  }

  const sendInvoice = async (id) => {
    await updateInvoice(id, { status: "pending" })
  }

  const getTotalRevenue = () => {
    return invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((total, invoice) => total + invoice.amount, 0)
  }

  const getPendingAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "pending" || invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount, 0)
  }

  const getOverdueAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount, 0)
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        getInvoices,
        getInvoiceById,
        getInvoicesByStatus,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        markAsOverdue,
        sendInvoice,
        getTotalRevenue,
        getPendingAmount,
        getOverdueAmount,
        refreshInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider")
  }
  return context
}
