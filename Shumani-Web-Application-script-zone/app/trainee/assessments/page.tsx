"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react"

const assessments = [
  {
    id: "1",
    title: "React Components Quiz",
    module: "React Fundamentals",
    type: "quiz",
    dueDate: "2024-01-20",
    status: "pending",
    timeLimit: "30 minutes",
    questions: 15,
    attempts: 0,
    maxAttempts: 3,
    description: "Test your knowledge of React components and props",
  },
  {
    id: "2",
    title: "JavaScript Project Assignment",
    module: "Advanced JavaScript",
    type: "assignment",
    dueDate: "2024-01-25",
    status: "in-progress",
    timeLimit: "No limit",
    submissionType: "file",
    attempts: 1,
    maxAttempts: 1,
    description: "Build a todo application using vanilla JavaScript",
  },
  {
    id: "3",
    title: "Database Design Assessment",
    module: "Database Fundamentals",
    type: "quiz",
    dueDate: "2024-01-15",
    status: "completed",
    timeLimit: "45 minutes",
    questions: 20,
    attempts: 1,
    maxAttempts: 2,
    score: 85,
    description: "Comprehensive test on database design principles",
  },
  {
    id: "4",
    title: "API Documentation Review",
    module: "API Development",
    type: "assignment",
    dueDate: "2024-01-18",
    status: "overdue",
    timeLimit: "No limit",
    submissionType: "text",
    attempts: 0,
    maxAttempts: 1,
    description: "Review and document the provided API endpoints",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "overdue":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
        <p className="text-gray-600 mt-2">Complete your assignments and track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className={getStatusColor(assessment.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(assessment.status)}
                      {assessment.status}
                    </span>
                  </Badge>
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Module:</span>
                  <span className="font-medium">{assessment.module}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Type:</span>
                  <Badge variant="outline">{assessment.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Due Date:</span>
                  <span className="font-medium">{assessment.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Limit:</span>
                  <span>{assessment.timeLimit}</span>
                </div>
                {assessment.type === "quiz" && (
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <span>{assessment.questions}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Attempts:</span>
                  <span>
                    {assessment.attempts}/{assessment.maxAttempts}
                  </span>
                </div>
                {assessment.score && (
                  <div className="flex items-center justify-between">
                    <span>Score:</span>
                    <span className="font-bold text-green-600">{assessment.score}%</span>
                  </div>
                )}
              </div>

              {assessment.attempts < assessment.maxAttempts && assessment.status !== "completed" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attempts remaining</span>
                    <span>{assessment.maxAttempts - assessment.attempts}</span>
                  </div>
                  <Progress value={(assessment.attempts / assessment.maxAttempts) * 100} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                {assessment.status === "pending" && (
                  <Button className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Start {assessment.type === "quiz" ? "Quiz" : "Assignment"}
                  </Button>
                )}
                {assessment.status === "in-progress" && assessment.type === "assignment" && (
                  <Button className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Assignment
                  </Button>
                )}
                {assessment.status === "in-progress" && assessment.type === "quiz" && (
                  <Button className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Continue Quiz
                  </Button>
                )}
                {assessment.status === "completed" && (
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Results
                  </Button>
                )}
                {assessment.status === "overdue" && assessment.attempts < assessment.maxAttempts && (
                  <Button variant="destructive" className="flex-1">
                    Submit Late
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
