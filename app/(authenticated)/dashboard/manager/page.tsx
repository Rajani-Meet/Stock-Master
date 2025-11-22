"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertCircle, TrendingUp, CheckSquare, UserCheck } from "lucide-react"
import Link from "next/link"

export default function ManagerDashboard() {
  const [kpis, setKpis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await fetch("/api/dashboard/kpis")
        const data = await response.json()
        setKpis(data)
      } catch (error) {
        console.error("Failed to fetch KPIs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchKpis()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>

  const managerTasks = [
    { title: "Validate Pending Receipts", priority: "HIGH", link: "/receipts", count: kpis?.pendingReceipts || 0 },
    { title: "Review Low Stock Items", priority: "HIGH", link: "/products", count: kpis?.lowStockItems || 0 },
    { title: "Approve Delivery Orders", priority: "MEDIUM", link: "/deliveries", count: kpis?.pendingDeliveries || 0 },
    { title: "Monitor Transfer Operations", priority: "MEDIUM", link: "/transfers", count: kpis?.scheduledTransfers || 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{kpis?.lowStockItems || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(kpis?.pendingReceipts || 0) + (kpis?.pendingDeliveries || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Transfers</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.scheduledTransfers || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manager Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {managerTasks.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="text-sm font-medium">{task.title}</span>
                  <p className="text-xs text-muted-foreground">{task.count} items pending</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={task.priority === "HIGH" ? "destructive" : "default"}>
                    {task.priority}
                  </Badge>
                  <Link href={task.link}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}