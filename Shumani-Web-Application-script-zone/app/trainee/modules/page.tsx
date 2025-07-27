"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Play, CheckCircle, FileText } from "lucide-react"

const modules = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript",
    duration: "8 hours",
    progress: 85,
    status: "in-progress",
    lessons: 12,
    completedLessons: 10,
    category: "Frontend",
  },
  {
    id: "2",
    title: "Database Design Principles",
    description: "Master database design and SQL fundamentals",
    duration: "6 hours",
    progress: 100,
    status: "completed",
    lessons: 8,
    completedLessons: 8,
    category: "Backend",
  },
  {
    id: "3",
    title: "API Development with Node.js",
    description: "Build RESTful APIs using Node.js and Express",
    duration: "10 hours",
    progress: 45,
    status: "in-progress",
    lessons: 15,
    completedLessons: 7,
    category: "Backend",
  },
  {
    id: "4",
    title: "React.js Fundamentals",
    description: "Learn modern React development with hooks and components",
    duration: "12 hours",
    progress: 0,
    status: "not-started",
    lessons: 18,
    completedLessons: 0,
    category: "Frontend",
  },
]

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training Modules</h1>
        <p className="text-gray-600 mt-2">Access your assigned training modules and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline">{module.category}</Badge>
                {module.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-2 h-4 w-4" />
                {module.duration}
                <span className="mx-2">•</span>
                <FileText className="mr-2 h-4 w-4" />
                {module.completedLessons}/{module.lessons} lessons
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>

              <Button className="w-full" variant={module.status === "completed" ? "outline" : "default"}>
                {module.status === "completed" ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Review
                  </>
                ) : module.status === "not-started" ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Module
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Continue
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
