"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, TrendingUp, Package, Activity, FileSpreadsheet, FileText } from "lucide-react"

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
      setWarehouses(w || [])
      setCategories(c.data || [])
    })
  }, [])

  const generateReport = async (sendEmail = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value)
      })
      if (sendEmail) params.append('sendEmail', 'true')
      
      const response = await fetch(`/api/reports/${reportType}?${params}`)
      const data = await response.json()
      setReportData(data)
      
      if (sendEmail && data.success) {
        alert('Report generated and sent to your email!')
      }
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (format: 'csv' | 'pdf') => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value)
      })
      params.append('format', format)
      
      const response = await fetch(`/api/reports/${reportType}/download?${params}`)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and download comprehensive reports</p>
          </div>
        </div>
        {reportData && (
          <div className="flex gap-2">
            <Button onClick={() => downloadReport('csv')} variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </Button>
            <Button onClick={() => downloadReport('pdf')} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>
        )}
      </div>

      <Card className="bg-white rounded-2xl shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-gray-900">Generate Report</CardTitle>
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
            <div className="flex gap-2">
              <Button onClick={generateReport} disabled={loading} className="mt-6">
                {loading ? "Generating..." : "Generate Report"}
              </Button>
              <Button onClick={() => generateReport(true)} disabled={loading} variant="outline" className="mt-6">
                Generate & Email
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
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                    <Package className="w-4 h-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{reportData.summary?.totalProducts || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">${reportData.summary?.totalValue || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{reportData.summary?.lowStockCount || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
                    <Activity className="w-4 h-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{reportData.summary?.outOfStockCount || 0}</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Movements</CardTitle>
                    <Activity className="w-4 h-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{reportData.summary?.totalMovements || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Inbound</CardTitle>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{reportData.summary?.inbound || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Outbound</CardTitle>
                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{reportData.summary?.outbound || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Adjustments</CardTitle>
                    <Package className="w-4 h-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{reportData.summary?.adjustments || 0}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card className="bg-white rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-900">Details</CardTitle>
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
                                item.quantity === 0 ? "bg-red-100 text-red-600" :
                                item.quantity <= item.product?.minStockLevel ? "bg-yellow-100 text-yellow-600" :
                                "bg-green-100 text-green-600"
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