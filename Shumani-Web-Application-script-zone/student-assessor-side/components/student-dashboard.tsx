"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import type { Submission } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

export default function StudentDashboard({ studentId }: { studentId: string }) {
  const { data, addSubmission, updateSubmission, getStudentSubmissions } = useAppContext()
  const student = data.students.find((s) => s.id === studentId)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submittingSubModuleId, setSubmittingSubModuleId] = useState<string | null>(null)

  if (!student) return <div className="p-6 text-center text-red-500">Student not found.</div>

  /**
   * Handles the submission of work for a specific sub-module.
   * If a submission already exists, it updates it; otherwise, it creates a new one.
   * @param {string} subModuleId The ID of the sub-module being submitted for.
   */
  const handleSubmit = (subModuleId: string) => {
    if (!selectedFile) return

    const existingSubmission = getStudentSubmissions(studentId, subModuleId)

    if (existingSubmission) {
      // If already submitted, update it (e.g., re-submission)
      updateSubmission({
        ...existingSubmission,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        status: "pending", // Reset status on re-submission
        score: null,
        submittedAt: new Date().toISOString(),
        markedAt: null,
      })
    } else {
      // New submission
      const newSubmission: Submission = {
        id: crypto.randomUUID(), // Generate a unique ID for the submission
        studentId: studentId,
        subModuleId: subModuleId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        status: "pending",
        score: null,
        submittedAt: new Date().toISOString(),
        markedAt: null,
      }
      addSubmission(newSubmission)
    }
    setSelectedFile(null) // Clear the selected file
    setSubmittingSubModuleId(null) // Close the submission form
  }

  /**
   * Determines the display properties (text, color, icon) for a sub-module's status.
   * @param {string} subModuleId The ID of the sub-module.
   * @returns {{ text: string, color: string, icon: JSX.Element }} The status display properties.
   */
  const getStatusDisplay = (subModuleId: string) => {
    const submission = getStudentSubmissions(studentId, subModuleId)
    if (!submission) return { text: "Not Submitted", color: "text-gray-500", icon: <Clock className="w-4 h-4" /> }

    switch (submission.status) {
      case "competent":
        return {
          text: `Competent (${submission.score}%)`,
          color: "text-green-600",
          icon: <CheckCircle className="w-4 h-4" />,
        }
      case "remedial":
        return {
          text: `Remedial (${submission.score}%)`,
          color: "text-orange-500",
          icon: <AlertCircle className="w-4 h-4" />,
        }
      case "dropout":
        return { text: `Dropout (${submission.score}%)`, color: "text-red-600", icon: <XCircle className="w-4 h-4" /> }
      case "pending":
      default:
        return { text: "Pending Review", color: "text-blue-500", icon: <Clock className="w-4 h-4" /> }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {student.name}!</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Modules and Sub-modules</h2>
      <div className="grid gap-6">
        {data.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>{module.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {module.subModules.map((subModule) => {
                const statusDisplay = getStatusDisplay(subModule.id)
                const submission = getStudentSubmissions(studentId, subModule.id)
                const isSubmitted = !!submission

                return (
                  <div
                    key={subModule.id}
                    className="border rounded-lg p-4 grid md:grid-cols-[1fr_auto] gap-4 items-center"
                  >
                    <div>
                      <h3 className="font-medium text-lg">{subModule.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{subModule.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        {statusDisplay.icon}
                        <span className={statusDisplay.color}>{statusDisplay.text}</span>
                        {isSubmitted && submission.fileName && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Submitted: {submission.fileName} [{submission.fileType}])
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {submittingSubModuleId === subModule.id ? (
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            className="flex-1"
                            aria-label={`Upload file for ${subModule.name}`}
                          />
                          <Button onClick={() => handleSubmit(subModule.id)} disabled={!selectedFile}>
                            Submit
                          </Button>
                          <Button variant="outline" onClick={() => setSubmittingSubModuleId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setSubmittingSubModuleId(subModule.id)}>
                          {isSubmitted ? "Re-submit Work" : "Submit Work"}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
