"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "trainee@demo.com",
    role: "trainee",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email, password) => {
    // Mock authentication
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "demo123") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = (data) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
