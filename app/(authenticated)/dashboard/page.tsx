"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Redirect to role-specific dashboard
      switch (parsedUser.role) {
        case "ADMIN":
          router.push("/dashboard/admin")
          break
        case "MANAGER":
          router.push("/dashboard/manager")
          break
        case "WAREHOUSE_STAFF":
          router.push("/dashboard/staff")
          break
        default:
          router.push("/dashboard/staff")
      }
    }
  }, [router])

  return <div className="text-center py-10">Redirecting to your dashboard...</div>
}
