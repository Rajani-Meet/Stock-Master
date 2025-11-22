"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("/api/warehouses")
        const data = await response.json()
        setWarehouses(data)
      } catch (error) {
        console.error("Failed to fetch warehouses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWarehouses()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Warehouses</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-muted-foreground">Loading warehouses...</p>
        ) : warehouses.length === 0 ? (
          <p className="text-muted-foreground">No warehouses found</p>
        ) : (
          warehouses.map((warehouse) => (
            <Card key={warehouse.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <CardTitle>{warehouse.name}</CardTitle>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{warehouse.code}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{warehouse.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{warehouse.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Locations</p>
                      <p className="font-medium">{warehouse.locations?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
