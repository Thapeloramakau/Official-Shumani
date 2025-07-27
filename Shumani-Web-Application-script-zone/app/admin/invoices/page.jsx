"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Download,
} from "lucide-react"
import { useInvoices } from "../invoices/useInvoices"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser";
import { jsPDF } from "jspdf"



const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    case "draft":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}



export default function InvoicesPage() {
  const {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    sendInvoice,
    getTotalRevenue,
    getPendingAmount,
    getOverdueAmount,
  } = useInvoices()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [viewMode, setViewMode] = useState("table") // table or cards

  const [newInvoice, setNewInvoice] = useState({
    traineeName: "",
    traineeEmail: "",
    programName: "",
    amount: "",
    dueDate: "",
    description: "",
    notes: "",
    status: "draft",
  })

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    paidDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (selectedInvoice && isEditDialogOpen) {
      setNewInvoice({
        traineeName: selectedInvoice.trainee_name,
        traineeEmail: selectedInvoice.trainee_email,
        programName: selectedInvoice.program_name,
        amount: selectedInvoice.amount,
        dueDate: selectedInvoice.due_date || "",
        description: selectedInvoice.description,
        notes: selectedInvoice.notes,
        status: selectedInvoice.status,
      })
    }
  }, [selectedInvoice, isEditDialogOpen])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.trainee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.program_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount, currency = "ZAR") => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calculateInvoiceStatus = (invoice) => {
    if (invoice.status === "paid") return "paid"
    if (invoice.due_date && new Date(invoice.due_date) < new Date()) return "overdue"
    if (invoice.status === "pending") return "pending"
    return invoice.status || "draft"
  }

  const handleCreateInvoice = async () => {
    if (!newInvoice.traineeName || !newInvoice.traineeEmail || !newInvoice.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const invoiceData = {
      trainee_name: newInvoice.traineeName,
      trainee_email: newInvoice.traineeEmail,
      program_name: newInvoice.programName,
      amount: Number.parseFloat(newInvoice.amount),
      due_date: newInvoice.dueDate || null,
      description: newInvoice.description,
      notes: newInvoice.notes,
      status: newInvoice.status,
      created_at: new Date().toISOString(),
    }

    try {
      await addInvoice(invoiceData)
      toast({
        title: "Invoice Created",
        description: "Invoice has been successfully created",
      })
      setNewInvoice({
        traineeName: "",
        traineeEmail: "",
        programName: "",
        amount: "",
        dueDate: "",
        description: "",
        notes: "",
        status: "draft",
      })
      setIsCreateDialogOpen(false)
    } catch {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      })
    }
  }

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return

    if (!newInvoice.traineeName || !newInvoice.traineeEmail || !newInvoice.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedData = {
      trainee_name: newInvoice.traineeName,
      trainee_email: newInvoice.traineeEmail,
      program_name: newInvoice.programName,
      amount: Number.parseFloat(newInvoice.amount),
      due_date: newInvoice.dueDate || null,
      description: newInvoice.description,
      notes: newInvoice.notes,
      status: newInvoice.status,
    }

    try {
      await updateInvoice(selectedInvoice.id, updatedData)
      toast({
        title: "Invoice Updated",
        description: "Invoice has been successfully updated",
      })
      setIsEditDialogOpen(false)
      setSelectedInvoice(null)
    } catch {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice) return
    if (!paymentData.paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }
    

    try {
      await markAsPaid(selectedInvoice.id, paymentData.paymentMethod, paymentData.paidDate)
      toast({
        title: "Payment Recorded",
        description: "Invoice has been marked as paid",
      })
      setPaymentData({ paymentMethod: "", paidDate: new Date().toISOString().split('T')[0] })
      setIsPaymentDialogOpen(false)
      setSelectedInvoice(null)
    } catch {
      toast({
        title: "Error",
        description: "Failed to mark invoice as paid",
        variant: "destructive",
      })
    }
  }

  const handleSendInvoice = async (invoice) => {
  try {
    // 1. Generate and download the PDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 10, 40);
    doc.text(`Trainee: ${invoice.trainee_name}`, 10, 50);
    doc.text(`Email: ${invoice.trainee_email}`, 10, 60);
    doc.text(`Program: ${invoice.program_name}`, 10, 70);
    doc.text(`Amount: $${invoice.amount}`, 10, 80);
    doc.text(`Due Date: ${invoice.due_date}`, 10, 90);
    doc.text(`Description: ${invoice.description || "N/A"}`, 10, 100);
    doc.save(`invoice-${invoice.id}.pdf`);

    // 2. EmailJS sending
    const templateParams = {
      trainee_name: invoice.trainee_name,
      trainee_email: invoice.trainee_email,
      invoice_id: invoice.id,
      amount: invoice.amount,
      program_name: invoice.program_name,
      due_date: invoice.due_date,
      description: invoice.description || "N/A",
    };

    await emailjs.send(
      "service_nrfv22k",        // your service ID
      "template_zq0xgap",       // your template ID
      templateParams,
      "Ivj2wIjxgEr0pr2ZC"       // your public API key
    );

    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoice.id} has been sent to ${invoice.trainee_email}`,
    });
  } catch (error) {
    console.error("Invoice sending failed:", error);
    toast({
      title: "Error",
      description: "Failed to send invoice",
      variant: "destructive",
    });
  }
};
  
  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId)
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been successfully deleted",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-2">Track and manage training program payments (Reference Only)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
            {viewMode === "table" ? "Card View" : "Table View"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Create a new invoice for training program payment tracking</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="traineeName">Trainee Name *</Label>
                    <Input
                      id="traineeName"
                      value={newInvoice.traineeName}
                      onChange={(e) => setNewInvoice({ ...newInvoice, traineeName: e.target.value })}
                      placeholder="Enter trainee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traineeEmail">Trainee Email *</Label>
                    <Input
                      id="traineeEmail"
                      type="email"
                      value={newInvoice.traineeEmail}
                      onChange={(e) => setNewInvoice({ ...newInvoice, traineeEmail: e.target.value })}
                      placeholder="Enter trainee email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                      id="programName"
                      value={newInvoice.programName}
                      onChange={(e) => setNewInvoice({ ...newInvoice, programName: e.target.value })}
                      placeholder="Enter program name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (R) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newInvoice.status}
                      onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                    placeholder="Enter invoice description"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    placeholder="Enter any additional notes"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateInvoice}>
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalRevenue())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(getPendingAmount())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(getOverdueAmount())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by trainee name, ID or program"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
              className="w-48"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      {viewMode === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Trainee Name</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const status = calculateInvoiceStatus(invoice)
                return (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.trainee_name}</TableCell>
                    <TableCell>{invoice.program_name}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatDate(invoice.due_date)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedInvoice(invoice)
                            setIsViewDialogOpen(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedInvoice(invoice)
                            setIsEditDialogOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {status !== "paid" && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedInvoice(invoice)
                              setIsPaymentDialogOpen(true)
                            }}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleSendInvoice(invoice)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => {
            const status = calculateInvoiceStatus(invoice)
            return (
              <Card key={invoice.id} className="p-4">
                <CardHeader>
                  <CardTitle>{invoice.trainee_name}</CardTitle>
                  <CardDescription>ID: {invoice.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Program: {invoice.program_name || "-"}</p>
                  <p>Amount: {formatCurrency(invoice.amount)}</p>
                  <p>Due: {formatDate(invoice.due_date)}</p>
                  <Badge className={`mt-2 ${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                </CardContent>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedInvoice(invoice)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedInvoice(invoice)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  {status !== "paid" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedInvoice(invoice)
                        setIsPaymentDialogOpen(true)
                      }}
                    >
                      Mark Paid
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => handleSendInvoice(invoice)}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogDescription>
                  Invoice ID: {selectedInvoice.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Trainee Name</Label>
                    <p className="text-sm">{selectedInvoice.trainee_name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Trainee Email</Label>
                    <p className="text-sm">{selectedInvoice.trainee_email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Program Name</Label>
                    <p className="text-sm">{selectedInvoice.program_name || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <p className="text-sm">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <p className="text-sm">{formatDate(selectedInvoice.due_date)}</p>
                  </div>
                  <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="text-sm">
                    <Badge className={getStatusColor(calculateInvoiceStatus(selectedInvoice))}>
                      {calculateInvoiceStatus(selectedInvoice)}
                    </Badge>
                  </div>
                </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="text-sm">{selectedInvoice.description || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <p className="text-sm">{selectedInvoice.notes || "-"}</p>
                </div>
                {selectedInvoice.status === "paid" && selectedInvoice.payment_info && (
                  <div className="space-y-2">
                    <Label>Payment Information</Label>
                    <p className="text-sm">Method: {selectedInvoice.payment_info.method}</p>
                    <p className="text-sm">Date: {formatDate(selectedInvoice.payment_info.date)}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsViewDialogOpen(false)
                  setIsEditDialogOpen(true)
                }}>
                  Edit Invoice
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false)
                  handleSendInvoice(selectedInvoice)
                }}>
                  Send Invoice
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Edit invoice ID: {selectedInvoice?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTraineeName">Trainee Name *</Label>
                <Input
                  id="editTraineeName"
                  value={newInvoice.traineeName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, traineeName: e.target.value })}
                  placeholder="Enter trainee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTraineeEmail">Trainee Email *</Label>
                <Input
                  id="editTraineeEmail"
                  type="email"
                  value={newInvoice.traineeEmail}
                  onChange={(e) => setNewInvoice({ ...newInvoice, traineeEmail: e.target.value })}
                  placeholder="Enter trainee email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProgramName">Program Name</Label>
                <Input
                  id="editProgramName"
                  value={newInvoice.programName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, programName: e.target.value })}
                  placeholder="Enter program name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAmount">Amount (R) *</Label>
                <Input
                  id="editAmount"
                  type="number"
                  step="0.01"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDueDate">Due Date</Label>
                <Input
                  id="editDueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={newInvoice.status}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                placeholder="Enter invoice description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea
                id="editNotes"
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                placeholder="Enter any additional notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateInvoice}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription>
              Mark payment received for invoice ID: {selectedInvoice?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidDate">Payment Date *</Label>
              <Input
                id="paidDate"
                type="date"
                value={paymentData.paidDate}
                onChange={(e) => setPaymentData({ ...paymentData, paidDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleMarkAsPaid}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}