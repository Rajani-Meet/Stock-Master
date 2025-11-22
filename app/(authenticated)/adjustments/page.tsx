"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Settings2, Eye, TrendingUp, TrendingDown } from "lucide-react"
import AdjustmentForm from "@/components/AdjustmentForm"

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [locations, setLocations] = useState<any[]>([])

  const fetchAdjustments = async () => {
    try {
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      
      const response = await fetch(`/api/adjustments?${params}`)
      const data = await response.json()
      setAdjustments(data.adjustments || [])
    } catch (error) {
      console.error("Failed to fetch adjustments:", error)
      setAdjustments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations")
      const data = await response.json()
      setLocations(data.data || [])
    } catch (error) {
      console.error("Failed to fetch locations:", error)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  useEffect(() => {
    fetchAdjustments()
  }, [typeFilter])

  const getTypeVariant = (type: string) => {
    const variants: Record<string, any> = {
      PHYSICAL_COUNT: "secondary",
      DAMAGE: "destructive",
      LOSS: "warning",
      GAIN: "success",
      EXPIRY: "outline",
    }
    return variants[type] || "secondary"
  }

  const calculateTotalAdjustment = (items: any[]) => {
    return items?.reduce((sum, item) => sum + (item.adjustedQty - item.currentQty), 0) || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock Adjustments</h1>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Create Adjustment
        </Button>
      </div>
      
      <AdjustmentForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchAdjustments} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PHYSICAL_COUNT">Physical Count</SelectItem>
                <SelectItem value="DAMAGE">Damage</SelectItem>
                <SelectItem value="LOSS">Loss</SelectItem>
                <SelectItem value="GAIN">Gain</SelectItem>
                <SelectItem value="EXPIRY">Expiry</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline">Total: {adjustments.length}</Badge>
              <Badge variant="success">Gains: {adjustments.filter(a => a.type === 'GAIN').length}</Badge>
              <Badge variant="warning">Losses: {adjustments.filter(a => ['DAMAGE', 'LOSS', 'EXPIRY'].includes(a.type)).length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading adjustments...</p>
          ) : adjustments.length === 0 ? (
            <div className="text-center py-8">
              <Settings2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No adjustments found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {adjustments.map((adjustment) => {
                const totalAdjustment = calculateTotalAdjustment(adjustment.items)
                return (
                  <div
                    key={adjustment.id}
                    className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings2 className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{adjustment.adjustmentNo}</p>
                          <p className="text-sm text-muted-foreground">{adjustment.reason}</p>
                          <p className="text-xs text-muted-foreground">
                            {locations.find(l => l.id === adjustment.locationId)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {totalAdjustment > 0 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : totalAdjustment < 0 ? (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          ) : null}
                          <span className={`text-sm font-medium ${
                            totalAdjustment > 0 ? 'text-success' : 
                            totalAdjustment < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {totalAdjustment > 0 ? '+' : ''}{totalAdjustment}
                          </span>
                        </div>
                        <Badge variant={getTypeVariant(adjustment.type)}>
                          {adjustment.type.replace('_', ' ')}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Items Adjusted</p>
                        <p className="font-medium">{adjustment.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Change</p>
                        <p className={`font-medium ${
                          totalAdjustment > 0 ? 'text-success' : 
                          totalAdjustment < 0 ? 'text-destructive' : ''
                        }`}>
                          {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} units
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Adjustment Date</p>
                        <p className="font-medium">{new Date(adjustment.adjustmentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created By</p>
                        <p className="font-medium">{adjustment.createdBy?.name || 'System'}</p>
                      </div>
                    </div>
                    {adjustment.notes && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        <span className="text-muted-foreground">Notes: </span>
                        {adjustment.notes}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
