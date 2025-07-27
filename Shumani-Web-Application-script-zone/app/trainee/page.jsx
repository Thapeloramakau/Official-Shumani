"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Users, Bell, Play } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"
import { useSessions } from "@/components/session-provider"

const recentModules = [
  {
    id: "1",
    title: "Introduction to Web Development",
    progress: 85,
    status: "in-progress",
  },
  {
    id: "2",
    title: "Database Design Principles",
    progress: 100,
    status: "completed",
  },
  {
    id: "3",
    title: "API Development",
    progress: 45,
    status: "in-progress",
  },
]

export default function TraineeDashboard() {
  const { user } = useAuth()
  const { getNotifications, getUnreadCount } = useNotifications()
  const { getUpcomingSessions } = useSessions()

  const notifications = getNotifications(user?.role).slice(0, 3)
  const unreadCount = getUnreadCount(user?.role)
  const upcomingSessions = getUpcomingSessions().slice(0, 2)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Continue your learning journey and track your progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Modules</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Training Sessions
            </CardTitle>
            <CardDescription>Your scheduled training sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{session.title}</h4>
                  <p className="text-sm text-gray-600">
                    {session.date} at {session.time.split(" - ")[0]} • {session.duration}
                  </p>
                  <p className="text-sm text-gray-500">Instructor: {session.instructor}</p>
                </div>
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Join
                </Button>
              </div>
            ))}
            {upcomingSessions.length === 0 && <p className="text-gray-500 text-center py-4">No upcoming sessions</p>}
          </CardContent>
        </Card>

        {/* Recent Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Training Modules
            </CardTitle>
            <CardDescription>Continue your learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentModules.map((module) => (
              <div key={module.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{module.title}</h4>
                  <Badge variant={module.status === "completed" ? "default" : "secondary"}>
                    {module.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${module.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600">{module.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
