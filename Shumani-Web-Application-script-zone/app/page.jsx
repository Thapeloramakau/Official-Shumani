"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/trainee")
      }
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Training Management System</h1>
          <p className="mt-2 text-gray-600">Sign in to access your training portal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
