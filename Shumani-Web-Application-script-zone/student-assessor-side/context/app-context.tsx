"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import type { AppData, Submission, Student, SubModule } from "@/lib/types"
import { initializeData, loadData, saveData } from "@/lib/data-utils"

interface AppContextType {
  data: AppData
  updateSubmission: (submission: Submission) => void
  addSubmission: (newSubmission: Submission) => void
  getStudentSubmissions: (studentId: string, subModuleId: string) => Submission | undefined
  getStudentById: (studentId: string) => Student | undefined
  getSubModuleById: (subModuleId: string) => SubModule | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initializeData)

  // Load data from localStorage on initial mount
  useEffect(() => {
    setData(loadData())
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveData(data)
  }, [data])

  /**
   * Updates an existing submission in the application state.
   * @param {Submission} updatedSubmission The submission object with updated values.
   */
  const updateSubmission = (updatedSubmission: Submission) => {
    setData((prevData) => {
      const newSubmissions = prevData.submissions.map((sub) =>
        sub.id === updatedSubmission.id ? updatedSubmission : sub,
      )
      return {
        ...prevData,
        submissions: newSubmissions,
      }
    })
  }

  /**
   * Adds a new submission to the application state.
   * @param {Submission} newSubmission The new submission object to add.
   */
  const addSubmission = (newSubmission: Submission) => {
    setData((prevData) => ({
      ...prevData,
      submissions: [...prevData.submissions, newSubmission],
    }))
  }

  /**
   * Retrieves a specific submission for a student and sub-module.
   * @param {string} studentId The ID of the student.
   * @param {string} subModuleId The ID of the sub-module.
   * @returns {Submission | undefined} The found submission or undefined if not found.
   */
  const getStudentSubmissions = (studentId: string, subModuleId: string) => {
    return data.submissions.find((sub) => sub.studentId === studentId && sub.subModuleId === subModuleId)
  }

  /**
   * Retrieves a student by their ID.
   * @param {string} studentId The ID of the student.
   * @returns {Student | undefined} The found student or undefined if not found.
   */
  const getStudentById = (studentId: string) => {
    return data.students.find((s) => s.id === studentId)
  }

  /**
   * Retrieves a sub-module by its ID.
   * @param {string} subModuleId The ID of the sub-module.
   * @returns {SubModule | undefined} The found sub-module or undefined if not found.
   */
  const getSubModuleById = (subModuleId: string) => {
    for (const module of data.modules) {
      const subModule = module.subModules.find((sm) => sm.id === subModuleId)
      if (subModule) return subModule
    }
    return undefined
  }

  return (
    <AppContext.Provider
      value={{
        data,
        updateSubmission,
        addSubmission,
        getStudentSubmissions,
        getStudentById,
        getSubModuleById,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom hook to consume the AppContext.
 * Throws an error if used outside of an AppContextProvider.
 * @returns {AppContextType} The context value.
 */
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) throw new Error("useAppContext must be used within an AppContextProvider")
  return context
}
