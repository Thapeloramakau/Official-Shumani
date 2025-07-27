"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { useNotifications } from "@/components/notification-provider"
import { Home, BookOpen, Calendar, FileText, Bell, User, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/trainee", icon: Home },
  { name: "Modules", href: "/trainee/modules", icon: BookOpen },
  { name: "Sessions", href: "/trainee/sessions", icon: Calendar },
  { name: "Assessments", href: "/trainee/assessments", icon: FileText },
  { name: "Notifications", href: "/trainee/notifications", icon: Bell },
]

export function TraineeNavigation() {
  const { user, logout } = useAuth()
  const { getUnreadCount } = useNotifications()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const unreadCount = getUnreadCount(user?.role)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">TMS</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isNotifications = item.name === "Notifications"
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 relative",
                      pathname === item.href
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {isNotifications && unreadCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">{unreadCount}</Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/trainee/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden ml-2">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isNotifications = item.name === "Notifications"
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-base font-medium relative",
                      pathname === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {isNotifications && unreadCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">{unreadCount}</Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
