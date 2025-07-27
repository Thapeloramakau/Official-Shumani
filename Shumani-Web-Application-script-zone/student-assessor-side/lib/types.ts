export type Student = {
  id: string
  name: string
}

export type Module = {
  id: string
  name: string
  subModules: SubModule[]
}

export type SubModule = {
  id: string
  moduleId: string
  name: string
  description: string
}

export type SubmissionStatus = "pending" | "competent" | "remedial" | "dropout"

export type Submission = {
  id: string
  studentId: string
  subModuleId: string
  fileName: string // Stores the name of the uploaded file
  fileType: string // Stores the type of the uploaded file (e.g., "application/pdf")
  status: SubmissionStatus
  score: number | null
  submittedAt: string
  markedAt: string | null
}

export type AppData = {
  students: Student[]
  modules: Module[]
  submissions: Submission[]
}
