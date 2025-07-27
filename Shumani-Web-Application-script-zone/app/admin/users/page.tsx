"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Calendar,
  UserCheck,
  Shield,
  Clock,
  Users,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
  lastActive: string
  department?: string
  location?: string
  phone?: string
  avatar?: string
  permissions: string[]
  completedPrograms?: number
  activePrograms?: number
  programsManaging?: number
  totalStudents?: number
  assessmentsManaged?: number
  totalAssessments?: number
  sessionExpiry?: Date
  auditsPending?: number
  complianceReports?: number
  assignedClient?: string
  assignedTrainees?: string[]
  companyName?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    role: "trainee",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    department: "Engineering",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    completedPrograms: 3,
    activePrograms: 2,
    permissions: ["view_modules", "view_sessions", "view_assessments"],
    assignedClient: "6",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    role: "trainee",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "1 day ago",
    department: "Marketing",
    location: "Los Angeles, CA",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    completedPrograms: 2,
    activePrograms: 1,
    permissions: ["view_modules", "view_sessions", "view_assessments"],
    assignedClient: "6",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "moderator",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "30 minutes ago",
    department: "Training",
    location: "Chicago, IL",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    programsManaging: 4,
    totalStudents: 85,
    permissions: ["manage_sessions", "view_trainees", "manage_content", "view_analytics"],
  },
  {
    id: "4",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "assessor",
    status: "active",
    joinDate: "2023-11-15",
    lastActive: "1 hour ago",
    department: "Assessment",
    location: "San Francisco, CA",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    assessmentsManaged: 12,
    totalAssessments: 156,
    permissions: ["manage_assessments", "view_trainees", "grade_assessments", "generate_reports"],
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.wilson@external-audit.com",
    role: "external_user",
    status: "active",
    joinDate: "2024-01-25",
    lastActive: "15 minutes ago",
    department: "External Audit",
    location: "Remote",
    phone: "+1 (555) 789-0123",
    avatar: "/placeholder.svg?height=40&width=40",
    sessionExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000),
    auditsPending: 3,
    complianceReports: 8,
    permissions: ["view_compliance", "audit_programs", "generate_compliance_reports"],
  },
  {
    id: "6",
    name: "David Wilson",
    email: "david.wilson@clientcorp.com",
    role: "client",
    status: "active",
    joinDate: "2024-01-12",
    lastActive: "20 minutes ago",
    department: "Client Services",
    location: "Boston, MA",
    phone: "+1 (555) 567-8901",
    avatar: "/placeholder.svg?height=40&width=40",
    assignedTrainees: ["1", "2"],
    companyName: "ClientCorp Inc.",
    permissions: ["view_trainee_progress", "view_reports"],
  },
  {
    id: "7",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@company.com",
    role: "admin",
    status: "active",
    joinDate: "2023-10-01",
    lastActive: "5 minutes ago",
    department: "Administration",
    location: "Miami, FL",
    phone: "+1 (555) 678-9012",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["full_access"],
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800"
    case "moderator":
      return "bg-purple-100 text-purple-800"
    case "assessor":
      return "bg-orange-100 text-orange-800"
    case "trainee":
      return "bg-green-100 text-green-800"
    case "external_user":
      return "bg-blue-100 text-blue-800"
    case "client":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-yellow-100 text-yellow-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4" />
    case "moderator":
      return <Users className="h-4 w-4" />
    case "assessor":
      return <CheckCircle className="h-4 w-4" />
    case "trainee":
      return <UserCheck className="h-4 w-4" />
    case "external_user":
      return <Clock className="h-4 w-4" />
    case "client":
      return <Eye className="h-4 w-4" />
    default:
      return <UserCheck className="h-4 w-4" />
  }
}

const roleDescriptions: Record<string, string> = {
  admin: "Full system access and management capabilities",
  moderator: "Manage training sessions and content",
  assessor: "Create and grade assessments",
  trainee: "Access training materials and complete courses",
  external_user: "Temporary access for external auditing (2-hour sessions)",
  client: "View assigned trainee progress and reports",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "",
    department: "",
    location: "",
    phone: "",
    companyName: "",
    assignedTrainees: [],
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Please fill in all required fields")
      return
    }

    const userData: User = {
      ...newUser,
      id: Date.now().toString(),
      name: newUser.name || "",
      email: newUser.email || "",
      role: newUser.role || "",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      permissions: [],
    } as User

    // Set role-specific permissions
    switch (userData.role) {
      case "trainee":
        userData.permissions = ["view_modules", "view_sessions", "view_assessments"]
        userData.completedPrograms = 0
        userData.activePrograms = 0
        break
      case "moderator":
        userData.permissions = ["manage_sessions", "view_trainees", "manage_content", "view_analytics"]
        userData.programsManaging = 0
        userData.totalStudents = 0
        break
      case "assessor":
        userData.permissions = ["manage_assessments", "view_trainees", "grade_assessments", "generate_reports"]
        userData.assessmentsManaged = 0
        userData.totalAssessments = 0
        break
      case "external_user":
        userData.permissions = ["view_compliance", "audit_programs", "generate_compliance_reports"]
        userData.sessionExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)
        userData.auditsPending = 0
        userData.complianceReports = 0
        break
      case "client":
        userData.permissions = ["view_trainee_progress", "view_reports"]
        userData.assignedTrainees = []
        break
      case "admin":
        userData.permissions = ["full_access"]
        break
      default:
        userData.permissions = []
    }

    setUsers([userData, ...users])
    alert(`${userData.name} has been successfully added as ${userData.role}`)

    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      location: "",
      phone: "",
      companyName: "",
      assignedTrainees: [],
    })
    setIsCreateDialogOpen(false)
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "suspended" } : user)))
    alert("User has been suspended successfully")
  }

  const handleActivateUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
    alert("User has been activated successfully")
  }

  const handleExtendSession = (userId: string) => {
    const newExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)
    setUsers(users.map((user) => (user.id === userId ? { ...user, sessionExpiry: newExpiry } : user)))
    alert("External user session extended by 2 hours")
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    alert("User has been permanently deleted")
  }

  const getTimeRemaining = (sessionExpiry?: Date) => {
    if (!sessionExpiry) return null
    const now = new Date()
    const expiry = new Date(sessionExpiry)
    const timeLeft = expiry.getTime() - now.getTime()

    if (timeLeft <= 0) return "Expired"

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m remaining`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all user roles and access permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate role and permissions</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trainee">Trainee - Access training materials</SelectItem>
                    <SelectItem value="moderator">Moderator - Manage sessions and content</SelectItem>
                    <SelectItem value="assessor">Assessor - Create and grade assessments</SelectItem>
                    <SelectItem value="external_user">External User - Temporary audit access</SelectItem>
                    <SelectItem value="client">Client - View trainee progress</SelectItem>
                    <SelectItem value="admin">Administrator - Full system access</SelectItem>
                  </SelectContent>
                </Select>
                {newUser.role && <p className="text-sm text-gray-600 mt-1">{roleDescriptions[newUser.role]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newUser.department || ""}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="Enter department"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newUser.phone || ""}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newUser.location || ""}
                  onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>

              {newUser.role === "client" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={newUser.companyName || ""}
                    onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              {newUser.role === "external_user" && (
                <div className="bg-yellow-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> External users will have time-limited access (2 hours per session) and will
                      be automatically logged out when the session expires.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateUser}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {["admin", "moderator", "assessor", "trainee", "external_user", "client"].map((role) => {
          const count = users.filter((user) => user.role === role).length
          return (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(role)}
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-gray-600 capitalize">{role.replace("_", " ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Administrators</SelectItem>
            <SelectItem value="moderator">Moderators</SelectItem>
            <SelectItem value="assessor">Assessors</SelectItem>
            <SelectItem value="trainee">Trainees</SelectItem>
            <SelectItem value="external_user">External Users</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role.replace("_", " ")}</span>
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    {user.role === "external_user" && user.status === "active" && (
                      <DropdownMenuItem onClick={() => handleExtendSession(user.id)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Extend Session
                      </DropdownMenuItem>
                    )}
                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate User
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined {user.joinDate}
                </div>
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Last active {user.lastActive}
                </div>
                {user.department && (
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {user.department}
                  </div>
                )}
              </div>

              {/* External User Session Timer */}
              {user.role === "external_user" && user.sessionExpiry && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Session Time</span>
                    </div>
                    <span className="text-sm text-blue-600">{getTimeRemaining(user.sessionExpiry)}</span>
                  </div>
                </div>
              )}

              {/* Role-specific stats */}
              {user.role === "trainee" && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.completedPrograms}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{user.activePrograms}</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>
              )}

              {(user.role === "moderator" || user.role === "assessor") && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {user.programsManaging || user.assessmentsManaged || 0}
                    </p>
                    <p className="text-xs text-gray-600">{user.role === "moderator" ? "Programs" : "Assessments"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {user.totalStudents || user.totalAssessments || 0}
                    </p>
                    <p className="text-xs text-gray-600">{user.role === "moderator" ? "Students" : "Total"}</p>
                  </div>
                </div>
              )}

              {user.role === "external_user" && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{user.auditsPending || 0}</p>
                    <p className="text-xs text-gray-600">Audits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{user.complianceReports || 0}</p>
                    <p className="text-xs text-gray-600">Reports</p>
                  </div>
                </div>
              )}

              {user.role === "client" && (
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{user.assignedTrainees?.length || 0}</p>
                    <p className="text-xs text-gray-600">Assigned Trainees</p>
                  </div>
                  {user.companyName && <p className="text-sm text-gray-600 mt-2 text-center">{user.companyName}</p>}
                </div>
              )}

              <Button className="w-full bg-transparent" variant="outline">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {getRoleIcon(selectedUser.role)}
                      <span className="ml-1 capitalize">{selectedUser.role.replace("_", " ")}</span>
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Phone:</strong> {selectedUser.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedUser.location || "Not provided"}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedUser.department || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Join Date:</strong> {selectedUser.joinDate}
                    </p>
                    <p>
                      <strong>Last Active:</strong> {selectedUser.lastActive}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedUser.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <div>
                <h4 className="font-medium mb-2">Role & Permissions</h4>
                <p className="text-sm text-gray-600 mb-3">{roleDescriptions[selectedUser.role]}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions?.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* External User Session Info */}
              {selectedUser.role === "external_user" && selectedUser.sessionExpiry && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2 text-blue-800">Session Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Session Expires:</strong> {new Date(selectedUser.sessionExpiry).toLocaleString()}
                    </p>
                    <p>
                      <strong>Time Remaining:</strong> {getTimeRemaining(selectedUser.sessionExpiry)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      handleExtendSession(selectedUser.id)
                      setIsViewDialogOpen(false)
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Extend Session (2 hours)
                  </Button>
                </div>
              )}

              {/* Client Assigned Trainees */}
              {selectedUser.role === "client" && (
                <div>
                  <h4 className="font-medium mb-2">Assigned Trainees</h4>
                  {selectedUser.assignedTrainees?.length ? (
                    <div className="space-y-2">
                      {selectedUser.assignedTrainees.map((traineeId) => {
                        const trainee = users.find((u) => u.id === traineeId)
                        return trainee ? (
                          <div key={traineeId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={trainee.avatar || "/placeholder.svg"} alt={trainee.name} />
                              <AvatarFallback className="text-xs">{trainee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{trainee.name}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No trainees assigned</p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}