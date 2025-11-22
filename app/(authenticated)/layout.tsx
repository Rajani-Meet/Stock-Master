"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, Menu, Package, BarChart3, Warehouse, Settings, ArrowRight, Settings2 } from "lucide-react"

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

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { label: "Products", href: "/products", icon: Package },
    { label: "Warehouses", href: "/warehouses", icon: Warehouse },
    { label: "Receipts", href: "/receipts", icon: Package },
    { label: "Deliveries", href: "/deliveries", icon: Package },
    { label: "Transfers", href: "/transfers", icon: ArrowRight },
    { label: "Adjustments", href: "/adjustments", icon: Settings2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-foreground/5 border-r border-border transition-all duration-300`}
      >
        <div className="p-6 border-b border-border">
          <h1 className={`font-bold text-primary ${sidebarOpen ? "text-xl" : "text-xs"}`}>
            {sidebarOpen ? "StockMaster" : "SM"}
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background p-6 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
