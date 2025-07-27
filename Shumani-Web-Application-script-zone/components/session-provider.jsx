"use client"

import { createContext, useContext, useState } from "react"

const SessionContext = createContext(null)

// Mock sessions data
const mockSessions = [
  {
    id: "1",
    title: "React Fundamentals Workshop",
    instructor: "Sarah Johnson",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    duration: "2 hours",
    type: "workshop",
    status: "upcoming",
    attendees: 25,
    maxAttendees: 30,
    location: "Virtual - Zoom",
    description: "Deep dive into React components, hooks, and state management",
    program: "React Fundamentals",
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    instructor: "Mike Chen",
    date: "2024-01-17",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    type: "lecture",
    status: "upcoming",
    attendees: 18,
    maxAttendees: 25,
    location: "Conference Room A",
    description: "Explore closures, prototypes, and asynchronous programming",
    program: "Advanced JavaScript",
  },
  {
    id: "3",
    title: "Database Design Workshop",
    instructor: "Emily Davis",
    date: "2024-01-12",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    type: "workshop",
    status: "completed",
    attendees: 22,
    maxAttendees: 25,
    location: "Virtual - Teams",
    description: "Learn database normalization and relationship design",
    program: "Database Design",
  },
  {
    id: "4",
    title: "API Testing Best Practices",
    instructor: "David Wilson",
    date: "2024-01-20",
    time: "1:00 PM - 3:00 PM",
    duration: "2 hours",
    type: "hands-on",
    status: "upcoming",
    attendees: 15,
    maxAttendees: 20,
    location: "Lab Room 2",
    description: "Hands-on session with Postman and automated testing tools",
    program: "API Development",
  },
]

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(mockSessions)

  const getSessions = () => sessions

  const getUpcomingSessions = () => sessions.filter((session) => session.status === "upcoming")

  const getSessionById = (id) => sessions.find((session) => session.id === id)

  const addSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: Date.now().toString(),
      attendees: 0,
    }
    setSessions((prev) => [...prev, newSession])
    return newSession
  }

  const updateSession = (id, updates) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, ...updates } : session)))
  }

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }

  const joinSession = (id) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id && session.attendees < session.maxAttendees
          ? { ...session, attendees: session.attendees + 1 }
          : session,
      ),
    )
  }

  return (
    <SessionContext.Provider
      value={{
        getSessions,
        getUpcomingSessions,
        getSessionById,
        addSession,
        updateSession,
        deleteSession,
        joinSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSessions() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSessions must be used within a SessionProvider")
  }
  return context
}
