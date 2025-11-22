"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Package, TrendingUp, AlertCircle, BarChart3, Shield, DollarSign, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, warehousesRes] = await Promise.all([
          fetch(`/api/dashboard/kpis?${selectedWarehouse !== 'all' ? `warehouseId=${selectedWarehouse}&` : ''}dateFrom=${new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString()}`),
          fetch("/api/warehouses")
        ])
        const [kpisData, warehousesData] = await Promise.all([
          kpisRes.json(),
          warehousesRes.json()
        ])
        setKpis(kpisData)
        setWarehouses(warehousesData.data || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [timeRange, selectedWarehouse])

  if (loading) return <div className="text-center py-10">Loading...</div>

  const adminTasks = [
    { title: "Review Low Stock Alerts", priority: "HIGH", count: kpis?.inventory?.lowStockItems || 0, link: "/products?lowStock=true" },
    { title: "Pending Operations", priority: "MEDIUM", count: (kpis?.operations?.pendingReceipts || 0) + (kpis?.operations?.pendingDeliveries || 0), link: "/receipts" },
    { title: "System Performance", priority: "LOW", count: kpis?.alerts?.length || 0, link: "/settings" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              {warehouses.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.inventory?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(kpis?.inventory?.totalInventoryValue || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{kpis?.inventory?.lowStockItems || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
            <Activity className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.operations?.totalMovements || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last {timeRange} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Operations Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Receipts</span>
                <Badge variant="outline">{kpis?.operations?.pendingReceipts || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Deliveries</span>
                <Badge variant="outline">{kpis?.operations?.pendingDeliveries || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Scheduled Transfers</span>
                <Badge variant="outline">{kpis?.operations?.scheduledTransfers || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inbound Movements</span>
                <Badge variant="secondary">{kpis?.operations?.inboundMovements || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Outbound Movements</span>
                <Badge variant="secondary">{kpis?.operations?.outboundMovements || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminTasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{task.title}</span>
                    {task.count > 0 && (
                      <Badge variant={task.priority === "HIGH" ? "destructive" : "secondary"}>
                        {task.count}
                      </Badge>
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

      {kpis?.alerts && kpis.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpis.alerts.slice(0, 5).map((alert: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}