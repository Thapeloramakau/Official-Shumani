"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Calendar, AlertCircle, CheckCircle, Plus, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"
import { useSessions } from "@/components/session-provider"
import { useInvoices } from "@/components/invoice-provider"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { getNotifications, getUnreadCount } = useNotifications()
  const { getUpcomingSessions } = useSessions()
  const { getTotalRevenue, getPendingAmount } = useInvoices()

  const totalRevenue = getTotalRevenue()
  const pendingAmount = getPendingAmount()

  const stats = [
    {
      title: "Total Trainees",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Programs",
      value: "15",
      change: "+2",
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Sessions This Week",
      value: "32",
      change: "+8",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+15%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  const programProgress = [
    {
      name: "React Fundamentals",
      enrolled: 45,
      completed: 38,
      progress: 84,
    },
    {
      name: "Node.js Backend",
      enrolled: 32,
      completed: 28,
      progress: 88,
    },
    {
      name: "Database Design",
      enrolled: 28,
      completed: 22,
      progress: 79,
    },
  ]

  const notifications = getNotifications(user?.role).slice(0, 4)
  const unreadCount = getUnreadCount(user?.role)
  const upcomingSessions = getUpcomingSessions().slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-purple-100">Manage your training programs and track learner progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge variant="outline" className="ml-2 text-green-600">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                {notification.priority === "high" ? (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Scheduled training sessions</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{session.title}</h4>
                  <p className="text-sm text-gray-600">
                    {session.date} at {session.time.split(" - ")[0]}
                  </p>
                  <p className="text-sm text-gray-500">Instructor: {session.instructor}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{session.attendees} attendees</Badge>
                </div>
              </div>
            ))}
            {upcomingSessions.length === 0 && <p className="text-gray-500 text-center py-4">No upcoming sessions</p>}
          </CardContent>
        </Card>
      </div>

      {/* Program Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Program Progress Overview</CardTitle>
          <CardDescription>Track completion rates across training programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {programProgress.map((program) => (
              <div key={program.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{program.name}</h4>
                  <div className="text-sm text-gray-600">
                    {program.completed}/{program.enrolled} completed ({program.progress}%)
                  </div>
                </div>
                <Progress value={program.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
