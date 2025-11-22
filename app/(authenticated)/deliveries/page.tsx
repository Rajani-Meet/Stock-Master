"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Truck, Eye, CheckCircle } from "lucide-react"
import DeliveryForm from "@/components/DeliveryForm"
import FilterPanel from "@/components/FilterPanel"

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [warehouses, setWarehouses] = useState<any[]>([])

  const fetchDeliveries = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })
      
      const response = await fetch(`/api/deliveries?${params}`)
      const data = await response.json()
      setDeliveries(data.deliveries || [])
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
      setDeliveries([])
    } finally {
      setLoading(false)
    }
  }

  const fetchWarehouses = async () => {
    try {
      const response = await fetch("/api/warehouses")
      const data = await response.json()
      setWarehouses(data.data || [])
    } catch (error) {
      console.error("Failed to fetch warehouses:", error)
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  useEffect(() => {
    fetchDeliveries()
  }, [filters])

  const updateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      const response = await fetch("/api/deliveries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryId, status })
      })
      if (response.ok) {
        fetchDeliveries()
      }
    } catch (error) {
      console.error("Failed to update delivery status:", error)
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      DRAFT: "secondary",
      READY: "warning",
      DONE: "success",
      CANCELLED: "destructive",
    }
    return variants[status] || "secondary"
  }

  const getNextStatus = (currentStatus: string) => {
    const transitions: Record<string, string> = {
      DRAFT: "READY",
      READY: "DONE",
    }
    return transitions[currentStatus]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Delivery Orders</h1>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Create Delivery
        </Button>
      </div>
      
      <DeliveryForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchDeliveries} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <FilterPanel onFilter={setFilters} type="deliveries" />
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline">Total: {deliveries.length}</Badge>
              <Badge variant="secondary">Draft: {deliveries.filter(d => d.status === 'DRAFT').length}</Badge>
              <Badge variant="warning">Ready: {deliveries.filter(d => d.status === 'READY').length}</Badge>
              <Badge variant="success">Done: {deliveries.filter(d => d.status === 'DONE').length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading deliveries...</p>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No deliveries found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{delivery.deliveryNo}</p>
                        <p className="text-sm text-muted-foreground">{delivery.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {warehouses.find(w => w.id === delivery.warehouseId)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(delivery.status)}>
                        {delivery.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {getNextStatus(delivery.status) && (
                          <Button 
                            size="sm" 
                            onClick={() => updateDeliveryStatus(delivery.id, getNextStatus(delivery.status))}
                          >
                            {getNextStatus(delivery.status) === "READY" ? "Prepare" : "Complete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{delivery.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Quantity</p>
                      <p className="font-medium">
                        {delivery.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Date</p>
                      <p className="font-medium">{new Date(delivery.deliveryDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(delivery.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {delivery.notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {delivery.notes}
                    </div>
                  )}
                  {delivery.status === "READY" && (
                    <div className="mt-2 p-2 bg-warning/10 rounded text-sm text-warning">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Ready for delivery - items prepared and packed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
