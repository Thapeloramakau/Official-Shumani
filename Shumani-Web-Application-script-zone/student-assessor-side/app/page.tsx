"use client"

import { useState } from "react"
import { AppContextProvider } from "@/context/app-context"
import StudentDashboard from "@/components/student-dashboard"
import AssessorDashboard from "@/components/assessor-dashboard"
import ClientDashboard from "@/components/client-dashboard" // Import the new component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [viewMode, setViewMode] = useState<"student" | "assessor" | "client">("student") // Add 'client' mode
  const [selectedStudentId, setSelectedStudentId] = useState<string>("s1") // Default to Alice Smith

  return (
    <AppContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
          <div className="container flex h-16 items-center justify-between py-4">
            <h1 className="text-xl font-bold">Education App</h1>
            <div className="flex items-center gap-4">
              {/* Selector to switch between Student, Assessor, and Client views */}
              <Select value={viewMode} onValueChange={(value: "student" | "assessor" | "client") => setViewMode(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student View</SelectItem>
                  <SelectItem value="assessor">Assessor View</SelectItem>
                  <SelectItem value="client">Client View</SelectItem> {/* New Client View option */}
                </SelectContent>
              </Select>

              {/* Student selector, only visible in Student View */}
              {viewMode === "student" && (
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Alice Smith</SelectItem>
                    <SelectItem value="s2">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </header>
        <main>
          {viewMode === "student" ? (
            <StudentDashboard studentId={selectedStudentId} />
          ) : viewMode === "assessor" ? (
            <AssessorDashboard />
          ) : (
            <ClientDashboard /> // Render ClientDashboard for 'client' view
          )}
        </main>
      </div>
    </AppContextProvider>
  )
}
