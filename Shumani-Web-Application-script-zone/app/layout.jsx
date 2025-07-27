import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { UserProvider } from "@/components/user-provider"
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Training Management System",
  description: "Modern training management platform for trainees and administrators",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
