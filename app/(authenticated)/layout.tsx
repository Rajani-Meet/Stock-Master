"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, Menu, Package, BarChart3, Warehouse, Settings, ArrowRight, Settings2, History, User, Users, FileText } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    router.push("/login")
  }

  const getNavigationItems = () => {
    const dashboardHref = user?.role === "ADMIN" ? "/dashboard/admin" : 
                         user?.role === "MANAGER" ? "/dashboard/manager" : "/dashboard/staff"
    
    const baseItems = [
      { label: "Dashboard", href: dashboardHref, icon: BarChart3 },
      { label: "Products", href: "/products", icon: Package },
      { label: "Warehouses", href: "/warehouses", icon: Warehouse },
      { label: "Receipts", href: "/receipts", icon: Package },
      { label: "Deliveries", href: "/deliveries", icon: Package },
      { label: "Transfers", href: "/transfers", icon: ArrowRight },
      { label: "Adjustments", href: "/adjustments", icon: Settings2 },
      { label: "Move History", href: "/move-history", icon: History },
    ]

    // Add admin-only items
    if (user?.role === "ADMIN") {
      baseItems.push({ label: "Users", href: "/users", icon: Users })
    }

    baseItems.push(
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings }
    )

    return baseItems
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      <BackgroundEffects />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
      </div>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-50 w-64 lg:w-${sidebarOpen ? "64" : "20"} bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-300 h-full shadow-xl`}
      >
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  StockMaster
                </h1>
                <p className="text-xs text-gray-600">Inventory System</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-2 lg:p-4 space-y-1">
          {getNavigationItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:shadow-sm"
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {(sidebarOpen || window.innerWidth < 1024) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs font-medium text-green-800 mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700">All systems operational</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm p-4 lg:p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <Menu className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" />
            </button>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-xs text-gray-600 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all duration-200 hover:shadow-sm"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto relative z-10 bg-gray-50">
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
