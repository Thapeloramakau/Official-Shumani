"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  Bell,
  Plus,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"
import { useToast } from "@/hooks/use-toast"

const getNotificationIcon = (type) => {
  switch (type) {
    case "enrollment":
      return Users
    case "session":
      return Bell
    case "alert":
      return AlertCircle
    case "system":
      return CheckCircle
    default:
      return Bell
  }
}

const getNotificationColor = (type) => {
  switch (type) {
    case "enrollment":
      return "text-blue-600 bg-blue-100"
    case "session":
      return "text-green-600 bg-green-100"
    case "alert":
      return "text-red-600 bg-red-100"
    case "system":
      return "text-gray-600 bg-gray-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminNotificationsPage() {
  const { user } = useAuth()
  const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    addNotification,
  } = useNotifications()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRead, setFilterRead] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    type: "announcement",
    title: "",
    message: "",
    priority: "medium",
    targetRole: "trainee",
  })

  const notifications = getNotifications(user?.role)
  const unreadCount = getUnreadCount(user?.role)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && !notification.isRead) ||
      (filterRead === "read" && notification.isRead)

    return matchesSearch && matchesType && matchesRead
  })

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addNotification(newNotification, newNotification.targetRole)

    toast({
      title: "Notification Sent",
      description: `Notification sent to all ${newNotification.targetRole}s`,
    })

    setNewNotification({
      type: "announcement",
      title: "",
      message: "",
      priority: "medium",
      targetRole: "trainee",
    })
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-gray-600 mt-2">Manage system notifications and send announcements</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600">
            {unreadCount} unread
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>Create and send a notification to trainees or trainers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target" className="text-right">
                    Send To
                  </Label>
                  <Select
                    value={newNotification.targetRole}
                    onValueChange={(value) => setNewNotification({ ...newNotification, targetRole: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trainee">All Trainees</SelectItem>
                      <SelectItem value="trainer">All Trainers</SelectItem>
                      <SelectItem value="all">Everyone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="system">System Update</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newNotification.priority}
                    onValueChange={(value) => setNewNotification({ ...newNotification, priority: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter notification title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter notification message"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateNotification}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllAsRead(user?.role)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Type: {filterType === "all" ? "All" : filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("enrollment")}>Enrollments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("session")}>Sessions</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("alert")}>Alerts</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Read Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] bg-transparent">
                  Status: {filterRead === "all" ? "All" : filterRead}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterRead("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRead("unread")}>Unread</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRead("read")}>Read</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== "all" || filterRead !== "all"
                  ? "Try adjusting your search or filters"
                  : "No system notifications at this time."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const iconColorClass = getNotificationColor(notification.type)

            return (
              <Card
                key={notification.id}
                className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer",
                  !notification.isRead && "border-l-4 border-l-blue-500 bg-blue-50/30",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={cn("p-2 rounded-full", iconColorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn("font-semibold text-gray-900", !notification.isRead && "font-bold")}>
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)} variant="outline">
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {notification.type}
                            </Badge>
                          </div>

                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>

                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                              {notification.metadata.programName && (
                                <span>Program: {notification.metadata.programName}</span>
                              )}
                              {notification.metadata.count && <span>Count: {notification.metadata.count}</span>}
                              {notification.metadata.attendees && (
                                <span>Attendees: {notification.metadata.attendees}</span>
                              )}
                            </div>
                          )}

                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {notification.isRead ? (
                              <DropdownMenuItem onClick={() => markAsUnread(notification.id, user?.role)}>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Mark as unread
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id, user?.role)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => deleteNotification(notification.id, user?.role)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Summary Stats */}
      {filteredNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Summary</CardTitle>
            <CardDescription>Overview of system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter((n) => n.priority === "high").length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter((n) => n.type === "enrollment").length}
                </p>
                <p className="text-sm text-gray-600">Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
