"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, BookOpen, Clock, Award } from "lucide-react"

const overallStats = [
  {
    title: "Total Enrollments",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Completion Rate",
    value: "87.3%",
    change: "+5.2%",
    trend: "up",
    icon: Award,
    description: "vs last month",
  },
  {
    title: "Avg. Session Duration",
    value: "45 min",
    change: "-2.1%",
    trend: "down",
    icon: Clock,
    description: "vs last month",
  },
  {
    title: "Active Programs",
    value: "15",
    change: "+2",
    trend: "up",
    icon: BookOpen,
    description: "new this month",
  },
]

const programAnalytics = [
  {
    name: "React Fundamentals",
    enrolled: 45,
    completed: 38,
    inProgress: 7,
    completionRate: 84,
    avgRating: 4.8,
    category: "Frontend",
  },
  {
    name: "Node.js Backend",
    enrolled: 32,
    completed: 28,
    inProgress: 4,
    completionRate: 88,
    avgRating: 4.6,
    category: "Backend",
  },
  {
    name: "Database Design",
    enrolled: 28,
    completed: 22,
    inProgress: 6,
    completionRate: 79,
    avgRating: 4.4,
    category: "Database",
  },
  {
    name: "API Development",
    enrolled: 35,
    completed: 25,
    inProgress: 10,
    completionRate: 71,
    avgRating: 4.5,
    category: "Backend",
  },
]

const monthlyProgress = [
  { month: "Jan", enrollments: 120, completions: 95 },
  { month: "Feb", enrollments: 145, completions: 118 },
  { month: "Mar", enrollments: 132, completions: 125 },
  { month: "Apr", enrollments: 158, completions: 142 },
  { month: "May", enrollments: 175, completions: 156 },
  { month: "Jun", enrollments: 162, completions: 148 },
]

const topPerformers = [
  {
    name: "Alice Johnson",
    completedPrograms: 5,
    avgScore: 94,
    totalHours: 120,
    rank: 1,
  },
  {
    name: "Bob Smith",
    completedPrograms: 4,
    avgScore: 91,
    totalHours: 98,
    rank: 2,
  },
  {
    name: "Carol Davis",
    completedPrograms: 4,
    avgScore: 89,
    totalHours: 105,
    rank: 3,
  },
  {
    name: "David Wilson",
    completedPrograms: 3,
    avgScore: 92,
    totalHours: 87,
    rank: 4,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track performance and insights across your training programs</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendIcon
                        className={`h-4 w-4 mr-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      />
                      <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Program Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Program Performance</CardTitle>
            <CardDescription>Completion rates and ratings by program</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {programAnalytics.map((program) => (
              <div key={program.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{program.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{program.category}</Badge>
                      <span className="text-sm text-gray-600">⭐ {program.avgRating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{program.completionRate}%</p>
                    <p className="text-xs text-gray-600">
                      {program.completed}/{program.enrolled} completed
                    </p>
                  </div>
                </div>
                <Progress value={program.completionRate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest achieving trainees this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer) => (
              <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    {performer.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold">{performer.name}</h4>
                    <p className="text-sm text-gray-600">
                      {performer.completedPrograms} programs • {performer.totalHours}h
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{performer.avgScore}%</p>
                  <p className="text-xs text-gray-600">avg score</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Enrollment and completion trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyProgress.map((month) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Enrollments: {month.enrollments}</span>
                    <span>Completions: {month.completions}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(month.enrollments / 200) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-full bg-transparent rounded-full h-2 absolute top-0">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(month.completions / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              Enrollments
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              Completions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
