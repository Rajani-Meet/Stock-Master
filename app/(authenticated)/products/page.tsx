"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Package } from "lucide-react"
import ProductForm from "@/components/ProductForm"
import FilterPanel from "@/components/FilterPanel"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    category: "all",
    unit: "all",
    lowStock: false,
    sortBy: "name",
    sortOrder: "asc"
  })

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (filters.category !== "all") params.append("category", filters.category)
      if (filters.unit !== "all") params.append("unit", filters.unit)
      if (filters.lowStock) params.append("lowStock", "true")
      params.append("sortBy", filters.sortBy)
      params.append("sortOrder", filters.sortOrder)
      
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, filters])

  const getStockStatus = (product: any) => {
    const totalStock = product.stockLevels?.reduce((sum: number, sl: any) => sum + sl.quantity, 0) || 0
    if (totalStock === 0) return { status: "Out of Stock", variant: "destructive" as const }
    if (totalStock <= product.minStockLevel) return { status: "Low Stock", variant: "warning" as const }
    return { status: "In Stock", variant: "success" as const }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
      
      <ProductForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchProducts} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.unit} onValueChange={(value) => setFilters({...filters, unit: value})}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="All Units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  <SelectItem value="UNIT">Unit</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="L">Liter</SelectItem>
                  <SelectItem value="M">Meter</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant={filters.lowStock ? "default" : "outline"} 
                onClick={() => setFilters({...filters, lowStock: !filters.lowStock})}
                className="gap-2 w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                Low Stock
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="block sm:hidden space-y-4">
              {products.map((product) => {
                const stockStatus = getStockStatus(product)
                const totalStock = product.stockLevels?.reduce((sum: number, sl: any) => sum + sl.quantity, 0) || 0
                return (
                  <div key={product.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                      </div>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p>{product.category?.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit:</span>
                        <p>{product.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stock:</span>
                        <p className="font-medium">{totalStock}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Level:</span>
                        <p>{product.minStockLevel}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-muted/50" 
                        onClick={() => setFilters({...filters, sortBy: "name", sortOrder: filters.sortBy === "name" && filters.sortOrder === "asc" ? "desc" : "asc"})}>
                      Name {filters.sortBy === "name" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium">SKU</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Unit</th>
                    <th className="text-left py-3 px-4 font-medium">Stock Level</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Min Level</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product)
                    const totalStock = product.stockLevels?.reduce((sum: number, sl: any) => sum + sl.quantity, 0) || 0
                    return (
                      <tr key={product.id} className="border-b border-border hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 font-mono text-xs">{product.sku}</td>
                        <td className="py-3 px-4">{product.category?.name}</td>
                        <td className="py-3 px-4">{product.unit}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{totalStock}</span>
                            {product.stockLevels?.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {product.stockLevels.length} location{product.stockLevels.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{product.minStockLevel}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
