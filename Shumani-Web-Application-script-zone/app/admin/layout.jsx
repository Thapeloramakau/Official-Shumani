"use client"

import { useAuth } from "@/components/auth-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { SessionProvider } from "@/components/session-provider"
import { AdminNavigation } from "@/components/admin-navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { InvoiceProvider } from "@/components/invoice-provider"

export default function AdminLayout({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else if (user.role !== "admin") {
      router.push("/trainee")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <NotificationProvider>
      <SessionProvider>
        <InvoiceProvider>
          <div className="min-h-screen bg-gray-50">
            <AdminNavigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </InvoiceProvider>
      </SessionProvider>
    </NotificationProvider>
  )
}
