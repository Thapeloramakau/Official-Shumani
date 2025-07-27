"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Clock, BookOpen } from "lucide-react"

const programs = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Complete introduction to React development with hooks and components",
    category: "Frontend",
    duration: "8 weeks",
    modules: 12,
    enrolled: 45,
    completed: 38,
    status: "active",
    instructor: "Sarah Johnson",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express",
    category: "Backend",
    duration: "10 weeks",
    modules: 15,
    enrolled: 32,
    completed: 28,
    status: "active",
    instructor: "Mike Chen",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    title: "Database Design & SQL",
    description: "Master database design principles and SQL queries",
    category: "Database",
    duration: "6 weeks",
    modules: 8,
    enrolled: 28,
    completed: 22,
    status: "active",
    instructor: "Emily Davis",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "DevOps Fundamentals",
    description: "Introduction to DevOps practices and tools",
    category: "DevOps",
    duration: "12 weeks",
    modules: 18,
    enrolled: 0,
    completed: 0,
    status: "draft",
    instructor: "David Wilson",
    createdAt: "2024-01-12",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "draft":
      return "bg-yellow-100 text-yellow-800"
    case "archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Frontend":
      return "bg-blue-100 text-blue-800"
    case "Backend":
      return "bg-purple-100 text-purple-800"
    case "Database":
      return "bg-orange-100 text-orange-800"
    case "DevOps":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Programs</h1>
          <p className="text-gray-600 mt-2">Manage your training programs and modules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                    <Badge className={getCategoryColor(program.category)}>{program.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
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
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {program.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {program.modules} modules
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {program.enrolled} enrolled
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  {program.completed} completed
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>{program.enrolled > 0 ? Math.round((program.completed / program.enrolled) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${program.enrolled > 0 ? (program.completed / program.enrolled) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Instructor: <span className="font-medium">{program.instructor}</span>
                </p>
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
