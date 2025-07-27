"use client"

import { useState } from "react"
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
import { Calendar, Clock, Users, Video, MapPin, Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useSessions } from "@/components/session-provider"
import { useNotifications } from "@/components/notification-provider"
import { useToast } from "@/hooks/use-toast"

const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case "workshop":
      return "bg-purple-100 text-purple-800"
    case "lecture":
      return "bg-orange-100 text-orange-800"
    case "hands-on":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminSessionsPage() {
  const { getSessions, addSession, updateSession, deleteSession } = useSessions()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSession, setNewSession] = useState({
    title: "",
    instructor: "",
    date: "",
    time: "",
    duration: "",
    type: "workshop",
    maxAttendees: "",
    location: "",
    description: "",
    program: "",
  })

  const sessions = getSessions()

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateSession = () => {
    if (!newSession.title || !newSession.instructor || !newSession.date || !newSession.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const sessionData = {
      ...newSession,
      status: "upcoming",
      maxAttendees: Number.parseInt(newSession.maxAttendees) || 20,
    }

    const createdSession = addSession(sessionData)

    // Send notification to trainees
    addNotification(
      {
        type: "session",
        title: "New Training Session Scheduled",
        message: `${newSession.title} has been scheduled for ${newSession.date}`,
        priority: "medium",
        metadata: {
          sessionName: newSession.title,
          sessionTime: newSession.time,
        },
      },
      "trainee",
    )

    toast({
      title: "Session Created",
      description: "Training session has been successfully created and trainees have been notified",
    })

    setNewSession({
      title: "",
      instructor: "",
      date: "",
      time: "",
      duration: "",
      type: "workshop",
      maxAttendees: "",
      location: "",
      description: "",
      program: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId)
    toast({
      title: "Session Deleted",
      description: "Training session has been successfully deleted",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
          <p className="text-gray-600 mt-2">Schedule and manage training sessions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Training Session</DialogTitle>
              <DialogDescription>Schedule a new training session for trainees</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title *</Label>
                  <Input
                    id="title"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    placeholder="Enter session title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={newSession.instructor}
                    onChange={(e) => setNewSession({ ...newSession, instructor: e.target.value })}
                    placeholder="Enter instructor name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newSession.type}
                    onValueChange={(value) => setNewSession({ ...newSession, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="hands-on">Hands-on</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={newSession.maxAttendees}
                    onChange={(e) => setNewSession({ ...newSession, maxAttendees: e.target.value })}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={newSession.program}
                    onChange={(e) => setNewSession({ ...newSession, program: e.target.value })}
                    placeholder="Associated program"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  placeholder="e.g., Virtual - Zoom, Conference Room A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Enter session description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSession}>
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                    <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteSession(session.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {session.date}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {session.time} ({session.duration})
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Instructor: {session.instructor}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {session.location}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {session.attendees}/{session.maxAttendees} attendees
                </div>
              </div>

              <div className="flex gap-2">
                {session.status === "upcoming" && (
                  <Button className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Start Session
                  </Button>
                )}
                {session.status === "completed" && (
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Recording
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Create your first training session to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
