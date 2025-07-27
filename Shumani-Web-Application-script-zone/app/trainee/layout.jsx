"use client"

import { useAuth } from "@/components/auth-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { SessionProvider } from "@/components/session-provider"
import { TraineeNavigation } from "@/components/trainee-navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TraineeLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else if (user.role !== "trainee") {
      router.push("/admin")
    }
  }, [user, router])

  if (!user || user.role !== "trainee") {
    return null
  }

  return (
    <NotificationProvider>
      <SessionProvider>
        <div className="min-h-screen bg-gray-50">
          <TraineeNavigation />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </SessionProvider>
    </NotificationProvider>
  )
}
