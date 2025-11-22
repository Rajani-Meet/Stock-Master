"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, TrendingUp, Package, Activity } from "lucide-react"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("inventory")
  const [filters, setFilters] = useState({
    warehouseId: "all",
    categoryId: "all",
    dateFrom: "",
    dateTo: ""
  })
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/warehouses").then(r => r.json()),
      fetch("/api/categories").then(r => r.json())
    ]).then(([w, c]) => {
      setWarehouses(w.data || [])
      setCategories(c.data || [])
    })
  }, [])

  const generateReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value)
      })
      
      const response = await fetch(`/api/reports/${reportType}?${params}`)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="movements">Stock Movements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Warehouse</Label>
              <Select value={filters.warehouseId} onValueChange={(value) => setFilters({...filters, warehouseId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All warehouses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {warehouses.map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={filters.categoryId} onValueChange={(value) => setFilters({...filters, categoryId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={generateReport} disabled={loading} className="mt-6">
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>

          {reportType === "movements" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Date</Label>
                <Input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportType === "inventory" ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.summary?.totalProducts || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${reportData.summary?.totalValue || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <BarChart3 className="w-4 h-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{reportData.summary?.lowStockCount || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <Activity className="w-4 h-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{reportData.summary?.outOfStockCount || 0}</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
                    <Activity className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.summary?.totalMovements || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Inbound</CardTitle>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{reportData.summary?.inbound || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Outbound</CardTitle>
                    <BarChart3 className="w-4 h-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{reportData.summary?.outbound || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
                    <Package className="w-4 h-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.summary?.adjustments || 0}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {reportType === "inventory" ? (
                        <>
                          <th className="text-left py-2">Product</th>
                          <th className="text-left py-2">SKU</th>
                          <th className="text-left py-2">Location</th>
                          <th className="text-left py-2">Quantity</th>
                          <th className="text-left py-2">Status</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Product</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Quantity</th>
                          <th className="text-left py-2">Location</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(reportType === "inventory" ? reportData.details : reportData.movements)?.slice(0, 50).map((item: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        {reportType === "inventory" ? (
                          <>
                            <td className="py-2">{item.product?.name}</td>
                            <td className="py-2 font-mono text-xs">{item.product?.sku}</td>
                            <td className="py-2">{item.location?.name}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.quantity === 0 ? "bg-destructive/10 text-destructive" :
                                item.quantity <= item.product?.minStockLevel ? "bg-warning/10 text-warning" :
                                "bg-success/10 text-success"
                              }`}>
                                {item.quantity === 0 ? "Out of Stock" :
                                 item.quantity <= item.product?.minStockLevel ? "Low Stock" : "In Stock"}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="py-2">{item.product?.name}</td>
                            <td className="py-2">{item.moveType}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">{item.location?.name}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}