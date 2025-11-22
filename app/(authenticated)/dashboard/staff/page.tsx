"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, ArrowRight, Settings2, HardHat } from "lucide-react"
import Link from "next/link"

export default function StaffDashboard() {
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

  const staffTasks = [
    { title: "Process Incoming Receipts", priority: "HIGH", link: "/receipts", count: kpis?.pendingReceipts || 0 },
    { title: "Pick & Pack Orders", priority: "HIGH", link: "/deliveries", count: kpis?.pendingDeliveries || 0 },
    { title: "Execute Internal Transfers", priority: "MEDIUM", link: "/transfers", count: kpis?.scheduledTransfers || 0 },
    { title: "Perform Stock Counts", priority: "LOW", link: "/adjustments" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HardHat className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Warehouse Staff Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receipts to Process</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.pendingReceipts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders to Pick</CardTitle>
            <Truck className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{kpis?.pendingDeliveries || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transfers to Execute</CardTitle>
            <ArrowRight className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.scheduledTransfers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adjustments Needed</CardTitle>
            <Settings2 className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.lowStockItems || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffTasks.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <span className="text-sm font-medium">{task.title}</span>
                  {task.count !== undefined && (
                    <p className="text-xs text-muted-foreground">{task.count} items pending</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={task.priority === "HIGH" ? "destructive" : task.priority === "MEDIUM" ? "default" : "secondary"}>
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