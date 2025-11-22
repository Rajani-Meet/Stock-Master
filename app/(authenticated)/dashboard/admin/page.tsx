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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-full sm:w-48">
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
            <SelectTrigger className="w-full sm:w-32">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {kpis?.inventory?.totalProducts || 0}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              ${(kpis?.inventory?.totalInventoryValue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              Total stock value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {kpis?.inventory?.lowStockItems || 0}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              Need reordering
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stock Movements</CardTitle>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {kpis?.operations?.totalMovements || 0}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-500" />
              Last {timeRange} days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Operations Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                <span className="text-sm font-medium">Pending Receipts</span>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {kpis?.operations?.pendingReceipts || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-secondary/5 to-transparent border border-secondary/10">
                <span className="text-sm font-medium">Pending Deliveries</span>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  {kpis?.operations?.pendingDeliveries || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-accent/5 to-transparent border border-accent/10">
                <span className="text-sm font-medium">Scheduled Transfers</span>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  {kpis?.operations?.scheduledTransfers || 0}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Inbound</p>
                  <p className="text-lg font-bold text-secondary">{kpis?.operations?.inboundMovements || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Outbound</p>
                  <p className="text-lg font-bold text-primary">{kpis?.operations?.outboundMovements || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Priority Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminTasks.map((task, idx) => (
                <div key={idx} className="group p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === "HIGH" ? "bg-destructive" : 
                        task.priority === "MEDIUM" ? "bg-accent" : "bg-secondary"
                      }`} />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{task.title}</span>
                      {task.count > 0 && (
                        <Badge variant={task.priority === "HIGH" ? "destructive" : "secondary"} className="text-xs">
                          {task.count}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={task.priority === "HIGH" ? "destructive" : task.priority === "MEDIUM" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                      <Link href={task.link}>
                        <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          View
                        </Button>
                      </Link>
                    </div>
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
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded border gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
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