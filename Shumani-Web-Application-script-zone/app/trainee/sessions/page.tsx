"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, MapPin } from "lucide-react"

const sessions = [
  {
    id: "1",
    title: "React Fundamentals Workshop",
    instructor: "Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    type: "workshop",
    status: "upcoming",
    attendees: 25,
    maxAttendees: 30,
    location: "Virtual - Zoom",
    description: "Deep dive into React components, hooks, and state management",
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    instructor: "Mike Chen",
    date: "2024-01-17",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    type: "lecture",
    status: "upcoming",
    attendees: 18,
    maxAttendees: 25,
    location: "Conference Room A",
    description: "Explore closures, prototypes, and asynchronous programming",
  },
  {
    id: "3",
    title: "Database Design Workshop",
    instructor: "Emily Davis",
    date: "2024-01-12",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    type: "workshop",
    status: "completed",
    attendees: 22,
    maxAttendees: 25,
    location: "Virtual - Teams",
    description: "Learn database normalization and relationship design",
  },
  {
    id: "4",
    title: "API Testing Best Practices",
    instructor: "David Wilson",
    date: "2024-01-20",
    time: "1:00 PM - 3:00 PM",
    duration: "2 hours",
    type: "hands-on",
    status: "upcoming",
    attendees: 15,
    maxAttendees: 20,
    location: "Lab Room 2",
    description: "Hands-on session with Postman and automated testing tools",
  },
]

const getStatusColor = (status: string) => {
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

const getTypeColor = (type: string) => {
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

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training Sessions</h1>
        <p className="text-gray-600 mt-2">View and join your scheduled training sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map((session) => (
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
                    Join Session
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
    </div>
  )
}
