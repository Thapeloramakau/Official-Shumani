"use client"

import { useAppContext } from "@/context/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { Module, Student } from "@/lib/types"

export default function ClientDashboard() {
  const { data, getStudentSubmissions } = useAppContext()

  /**
   * Generates a progress report for a given student and module.
   * @param {Student} student The student object.
   * @param {Module} module The module object.
   * @returns {string} The formatted progress report string.
   */
  const generateProgressReport = (student: Student, module: Module): string => {
    let report = `Progress Report for ${student.name} - Module: ${module.name}\n\n`
    report += `Sub-modules:\n`

    let allSubModulesMarked = true
    let allSubModulesCompetent = true

    module.subModules.forEach((subModule) => {
      const submission = getStudentSubmissions(student.id, subModule.id)
      const statusText = submission
        ? `${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}`
        : "Not Submitted"
      const scoreText = submission?.score !== null ? ` (Score: ${submission.score}%)` : ""
      const fileNameText = submission?.fileName ? ` (File: ${submission.fileName})` : ""
      const submittedAtText = submission?.submittedAt
        ? ` (Submitted: ${new Date(submission.submittedAt).toLocaleString()})`
        : ""
      const markedAtText = submission?.markedAt ? ` (Marked: ${new Date(submission.markedAt).toLocaleString()})` : ""

      report += `- ${subModule.name}: ${statusText}${scoreText}${fileNameText}${submittedAtText}${markedAtText}\n`

      if (!submission || submission.status === "pending") {
        allSubModulesMarked = false
      }
      if (submission?.status !== "competent") {
        allSubModulesCompetent = false
      }
    })

    report += `\nOverall Module Status: `
    if (!allSubModulesMarked) {
      report += `In Progress (Not all sub-modules marked)`
    } else if (allSubModulesCompetent) {
      report += `Completed (All sub-modules competent)`
    } else {
      report += `Completed with Issues (Some sub-modules not competent)`
    }

    return report
  }

  /**
   * Handles the download of a progress report.
   * @param {Student} student The student for whom to download the report.
   * @param {Module} module The module for which to download the report.
   */
  const handleDownloadReport = (student: Student, module: Module) => {
    const reportContent = generateProgressReport(student, module)
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${student.name.replace(/\s/g, "_")}_${module.name.replace(/\s/g, "_")}_Progress_Report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client (Employer) Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Employee Progress Reports</h2>

      <div className="grid gap-6">
        {data.students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {data.modules.map((module) => {
                // Check if all sub-modules in this module have been marked for this student
                const allSubModulesMarked = module.subModules.every((subModule) => {
                  const submission = getStudentSubmissions(student.id, subModule.id)
                  return submission && submission.status !== "pending"
                })

                return (
                  <div key={module.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{module.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Status:{" "}
                        {allSubModulesMarked ? "All sub-modules marked" : "Some sub-modules pending/not submitted"}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadReport(student, module)}
                      disabled={!allSubModulesMarked}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </Button>
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
