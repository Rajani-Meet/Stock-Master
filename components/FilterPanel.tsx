"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"

interface FilterPanelProps {
  onFilter: (filters: any) => void
  type: "receipts" | "deliveries" | "products" | "transfers"
}

export default function FilterPanel({ onFilter, type }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: "all",
    warehouseId: "all",
    categoryId: "all",
    dateFrom: "",
    dateTo: ""
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/warehouses").then(r => r.json()),
      fetch("/api/categories").then(r => r.json())
    ]).then(([w, c]) => {
      setWarehouses(w.data || [])
      setCategories(c.data || [])
    })
  }, [])

  const handleApply = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "" && value !== "all")
    )
    onFilter(activeFilters)
    setOpen(false)
  }

  const handleClear = () => {
    setFilters({
      status: "all",
      warehouseId: "all",
      categoryId: "all",
      dateFrom: "",
      dateTo: ""
    })
    onFilter({})
  }

  const getStatusOptions = () => {
    switch (type) {
      case "receipts":
        return ["DRAFT", "WAITING", "VALIDATED", "CANCELLED"]
      case "deliveries":
        return ["DRAFT", "READY", "DONE", "CANCELLED"]
      case "transfers":
        return ["DRAFT", "WAITING", "READY", "DONE", "CANCELLED"]
      default:
        return []
    }
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Filter className="w-4 h-4" />
        Filters
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {type !== "products" && (
          <div>
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {getStatusOptions().map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>From Date</Label>
            <Input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} />
          </div>
          <div>
            <Label>To Date</Label>
            <Input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">Apply</Button>
          <Button variant="outline" onClick={handleClear}>Clear</Button>
        </div>
      </CardContent>
    </Card>
  )
}