"use client"

import { createContext, useContext, useState } from "react"

const NotificationContext = createContext(null)

// Mock notifications data
const mockTraineeNotifications = [
  {
    id: "1",
    type: "assignment",
    title: "New Assignment Available",
    message: "React Components Quiz has been assigned for React Fundamentals course",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "high",
    actionUrl: "/trainee/assessments",
    metadata: {
      programName: "React Fundamentals",
      dueDate: "2024-01-20",
    },
  },
  {
    id: "2",
    type: "session",
    title: "Upcoming Training Session",
    message: "Advanced JavaScript session starts in 1 hour",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "high",
    actionUrl: "/trainee/sessions",
    metadata: {
      programName: "Advanced JavaScript",
      sessionTime: "2:00 PM",
    },
  },
  {
    id: "3",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "Congratulations! You've completed Database Design Fundamentals",
    timestamp: "3 hours ago",
    isRead: true,
    priority: "medium",
    metadata: {
      programName: "Database Design Fundamentals",
    },
  },
  {
    id: "4",
    type: "reminder",
    title: "Assignment Due Soon",
    message: "JavaScript Project Assignment is due in 2 days",
    timestamp: "5 hours ago",
    isRead: false,
    priority: "medium",
    actionUrl: "/trainee/assessments",
    metadata: {
      programName: "Advanced JavaScript",
      dueDate: "2024-01-25",
    },
  },
]

const mockAdminNotifications = [
  {
    id: "1",
    type: "enrollment",
    title: "New Enrollments",
    message: "15 new trainees enrolled in React Fundamentals program",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "medium",
    actionUrl: "/admin/programs",
    metadata: {
      programName: "React Fundamentals",
      count: 15,
    },
  },
  {
    id: "2",
    type: "session",
    title: "Session Completed",
    message: "Advanced JavaScript session has been completed successfully",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "low",
    actionUrl: "/admin/sessions",
    metadata: {
      sessionName: "Advanced JavaScript",
      attendees: 22,
    },
  },
  {
    id: "3",
    type: "alert",
    title: "Low Attendance Alert",
    message: "Database Design session had only 12 out of 25 expected attendees",
    timestamp: "4 hours ago",
    isRead: false,
    priority: "high",
    actionUrl: "/admin/analytics",
    metadata: {
      sessionName: "Database Design",
      attendees: 12,
      expected: 25,
    },
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "Training platform has been updated with new features",
    timestamp: "1 day ago",
    isRead: true,
    priority: "low",
  },
]

export function NotificationProvider({ children }) {
  const [traineeNotifications, setTraineeNotifications] = useState(mockTraineeNotifications)
  const [adminNotifications, setAdminNotifications] = useState(mockAdminNotifications)

  const getNotifications = (userRole) => {
    return userRole === "admin" ? adminNotifications : traineeNotifications
  }

  const getUnreadCount = (userRole) => {
    const notifications = getNotifications(userRole)
    return notifications.filter((n) => !n.isRead).length
  }

  const markAsRead = (id, userRole) => {
    if (userRole === "admin") {
      setAdminNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    } else {
      setTraineeNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    }
  }

  const markAsUnread = (id, userRole) => {
    if (userRole === "admin") {
      setAdminNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: false } : notification)),
      )
    } else {
      setTraineeNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: false } : notification)),
      )
    }
  }

  const deleteNotification = (id, userRole) => {
    if (userRole === "admin") {
      setAdminNotifications((prev) => prev.filter((notification) => notification.id !== id))
    } else {
      setTraineeNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }
  }

  const markAllAsRead = (userRole) => {
    if (userRole === "admin") {
      setAdminNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } else {
      setTraineeNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    }
  }

  const addNotification = (notification, userRole) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: "Just now",
      isRead: false,
    }

    if (userRole === "admin") {
      setAdminNotifications((prev) => [newNotification, ...prev])
    } else {
      setTraineeNotifications((prev) => [newNotification, ...prev])
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        getNotifications,
        getUnreadCount,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
