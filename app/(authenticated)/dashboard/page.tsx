"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Package } from "lucide-react"

export default function DashboardPage() {
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

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-balance">Inventory Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">In stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{kpis?.lowStockItems || 0}</div>
            <p className="text-xs text-muted-foreground">Below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{kpis?.outOfStockItems || 0}</div>
            <p className="text-xs text-muted-foreground">No inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Ops</CardTitle>
            <TrendingUp className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {(kpis?.pendingReceipts || 0) + (kpis?.pendingDeliveries || 0) + (kpis?.scheduledTransfers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{kpis?.pendingReceipts || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">Awaiting validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{kpis?.pendingDeliveries || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">Ready to ship</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheduled Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{kpis?.scheduledTransfers || 0}</div>
            <p className="text-sm text-muted-foreground mt-2">In transit</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {kpis?.recentAlerts && kpis.recentAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kpis.recentAlerts.slice(0, 5).map((alert: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/5">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
