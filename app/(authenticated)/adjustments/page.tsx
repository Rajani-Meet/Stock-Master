"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings2 } from "lucide-react"

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdjustments = async () => {
      try {
        const response = await fetch("/api/adjustments")
        const data = await response.json()
        setAdjustments(data)
      } catch (error) {
        console.error("Failed to fetch adjustments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdjustments()
  }, [])

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PHYSICAL_COUNT: "bg-blue-100 text-blue-800",
      DAMAGE: "bg-red-100 text-red-800",
      LOSS: "bg-orange-100 text-orange-800",
      GAIN: "bg-green-100 text-green-800",
      EXPIRY: "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock Adjustments</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Adjustment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading adjustments...</p>
          ) : adjustments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No adjustments found</p>
          ) : (
            <div className="space-y-3 p-6">
              {adjustments.map((adjustment) => (
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
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(adjustment.type)}`}>
                      {adjustment.type}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{adjustment.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Adjustment Date</p>
                      <p className="font-medium">{new Date(adjustment.adjustmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(adjustment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
