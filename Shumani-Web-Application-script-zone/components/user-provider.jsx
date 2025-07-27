"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/superbase"  // Adjust this import path as needed

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [users, setUsers] = useState([])

  // Fetch users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("user_management").select("*")
      if (error) {
        console.error("Error fetching users:", error, JSON.stringify(error, null, 2))
      } else {
        setUsers(data)
      }
    }
    fetchUsers()
  }, [])

  const getUsers = () => users

  const getUserById = (id) => users.find((user) => user.id === id)

  const getUsersByRole = (role) => users.filter((user) => user.role === role)

  const addUser = async (userData) => {
  if (!userData.name || !userData.email || !userData.role) {
    console.error("Missing required user fields: name, email, or role.")
    return null
  }

  // Build user object explicitly
  const newUser = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    join_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    last_active: "Just now",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: [],

    // Set defaults, null if not applicable
    completed_programs: null,
    active_programs: null,
    programs_managing: null,
    total_students: null,
    assessments_managed: null,
    total_assessments: null,
    session_expiry: null,
    audits_pending: null,
    compliance_reports: null,
    assigned_client: null,
    assigned_trainees: null,
    company_name: null,
  }

  // Set role-specific fields
  switch (userData.role) {
    case "trainee":
      newUser.permissions = ["view_modules", "view_sessions", "view_assessments"]
      newUser.completed_programs = 0
      newUser.active_programs = 0
      newUser.assigned_trainees = null
      break
    case "moderator":
      newUser.permissions = ["manage_sessions", "view_trainees", "manage_content", "view_analytics"]
      newUser.programs_managing = 0
      newUser.total_students = 0
      break
    case "assessor":
      newUser.permissions = ["manage_assessments", "view_trainees", "grade_assessments", "generate_reports"]
      newUser.assessments_managed = 0
      newUser.total_assessments = 0
      break
    case "external_user":
      newUser.permissions = ["view_compliance", "audit_programs", "generate_compliance_reports"]
      newUser.session_expiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2h from now
      newUser.audits_pending = 0
      newUser.compliance_reports = 0
      break
    case "client":
      newUser.permissions = ["view_trainee_progress", "view_reports"]
      newUser.assigned_trainees = []
      break
    case "admin":
      newUser.permissions = ["full_access"]
      break
    default:
      newUser.permissions = []
  }


    // Insert new user into Supabase
    const { data, error } = await supabase.from("user_management").insert([newUser]).select().single()

    if (error) {
      console.error("Error adding user:", JSON.stringify(error, null, 2))
      return null
    }

    setUsers((prev) => [data, ...prev])
    return data
  }

  const updateUser = async (id, updates) => {
    const { data, error } = await supabase.from("user_management").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      return null
    }

    setUsers((prev) => prev.map((user) => (user.id === id ? data : user)))
    return data
  }

  const deleteUser = async (id) => {
    const { error } = await supabase.from("user_management").delete().eq("id", id)

    if (error) {
      console.error("Error deleting user:", error)
      return false
    }

    setUsers((prev) => prev.filter((user) => user.id !== id))
    return true
  }

  const suspendUser = (id) => updateUser(id, { status: "suspended" })

  const activateUser = (id) => updateUser(id, { status: "active" })

  const extendExternalSession = async (id, hours = 2) => {
    const user = getUserById(id)
    if (user && user.role === "external_user") {
      const newExpiry = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
      await updateUser(id, { session_expiry: newExpiry })
    }
  }

  const assignTraineeToClient = async (traineeId, clientId) => {
    const client = getUserById(clientId)
    if (client && client.role === "client") {
      const updatedTrainees = [...(client.assigned_trainees || []), traineeId]
      await updateUser(clientId, { assigned_trainees: updatedTrainees })
      await updateUser(traineeId, { assigned_client: clientId })
    }
  }

  const removeTraineeFromClient = async (traineeId, clientId) => {
    const client = getUserById(clientId)
    if (client && client.role === "client") {
      const updatedTrainees = client.assigned_trainees.filter((id) => id !== traineeId)
      await updateUser(clientId, { assigned_trainees: updatedTrainees })
      await updateUser(traineeId, { assigned_client: null })
    }
  }

  return (
    <UserContext.Provider
      value={{
        getUsers,
        getUserById,
        getUsersByRole,
        addUser,
        updateUser,
        deleteUser,
        suspendUser,
        activateUser,
        extendExternalSession,
        assignTraineeToClient,
        removeTraineeFromClient,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider")
  }
  return context
}
