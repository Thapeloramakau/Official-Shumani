"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import type { Submission, SubmissionStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

export default function AssessorDashboard() {
  const { data, updateSubmission, getStudentById, getSubModuleById } = useAppContext()
  const [markingSubmissionId, setMarkingSubmissionId] = useState<string | null>(null)
  const [score, setScore] = useState<number | string>("")

  // Filter submissions into pending and marked categories
  const pendingSubmissions = data.submissions.filter((sub) => sub.status === "pending")
  const markedSubmissions = data.submissions.filter((sub) => sub.status !== "pending")

  /**
   * Handles the marking of a submission.
   * Calculates the status (competent, remedial, dropout) based on the score.
   * @param {Submission} submission The submission object to be marked.
   */
  const handleMarkSubmission = (submission: Submission) => {
    const parsedScore = Number(score)
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      alert("Please enter a valid score between 0 and 100.")
      return
    }

    let status: SubmissionStatus
    if (parsedScore >= 50) {
      status = "competent"
    } else if (parsedScore >= 45 && parsedScore < 50) {
      status = "remedial"
    } else {
      status = "dropout"
    }

    updateSubmission({
      ...submission,
      score: parsedScore,
      status: status,
      markedAt: new Date().toISOString(),
    })
    setMarkingSubmissionId(null) // Close the marking form
    setScore("") // Clear the score input
  }

  /**
   * Determines the display properties (text, color, icon) for a submission's status.
   * @param {SubmissionStatus} status The status of the submission.
   * @param {number | null} score The score of the submission.
   * @returns {{ text: string, color: string, icon: JSX.Element }} The status display properties.
   */
  const getStatusDisplay = (status: SubmissionStatus, score: number | null) => {
    switch (status) {
      case "competent":
        return { text: `Competent (${score}%)`, color: "text-green-600", icon: <CheckCircle className="w-4 h-4" /> }
      case "remedial":
        return { text: `Remedial (${score}%)`, color: "text-orange-500", icon: <AlertCircle className="w-4 h-4" /> }
      case "dropout":
        return { text: `Dropout (${score}%)`, color: "text-red-600", icon: <XCircle className="w-4 h-4" /> }
      case "pending":
      default:
        return { text: "Pending Review", color: "text-blue-500", icon: <Clock className="w-4 h-4" /> }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assessor Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Submissions ({pendingSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {pendingSubmissions.length === 0 ? (
            <p className="text-muted-foreground">No pending submissions.</p>
          ) : (
            pendingSubmissions.map((submission) => {
              const student = getStudentById(submission.studentId)
              const subModule = getSubModuleById(submission.subModuleId)
              if (!student || !subModule) return null // Ensure student and sub-module data exists

              return (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 grid md:grid-cols-[1fr_auto] gap-4 items-center"
                >
                  <div>
                    <h3 className="font-medium text-lg">
                      {student.name} - {subModule.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Document: {submission.documentName} (Submitted:{" "}
                      {new Date(submission.submittedAt).toLocaleString()})
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-500">
                      <Clock className="w-4 h-4" /> Pending Review
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {markingSubmissionId === submission.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Score (0-100)"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-28"
                          min="0"
                          max="100"
                          aria-label={`Score for ${student.name}'s ${subModule.name} submission`}
                        />
                        <Button onClick={() => handleMarkSubmission(submission)} disabled={score === ""}>
                          Mark
                        </Button>
                        <Button variant="outline" onClick={() => setMarkingSubmissionId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setMarkingSubmissionId(submission.id)
                          setScore("")
                        }}
                      >
                        Mark Submission
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marked Submissions ({markedSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {markedSubmissions.length === 0 ? (
            <p className="text-muted-foreground">No marked submissions yet.</p>
          ) : (
            markedSubmissions.map((submission) => {
              const student = getStudentById(submission.studentId)
              const subModule = getSubModuleById(submission.subModuleId)
              if (!student || !subModule) return null

              const statusDisplay = getStatusDisplay(submission.status, submission.score)

              return (
                <div key={submission.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">
                    {student.name} - {subModule.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Document: {submission.documentName} (Submitted: {new Date(submission.submittedAt).toLocaleString()})
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    {statusDisplay.icon}
                    <span className={statusDisplay.color}>{statusDisplay.text}</span>
                    {submission.markedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Marked: {new Date(submission.markedAt).toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
