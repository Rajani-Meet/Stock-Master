"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, Eye, MapPin } from "lucide-react"
import TransferForm from "@/components/TransferForm"
import FilterPanel from "@/components/FilterPanel"

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [locations, setLocations] = useState<any[]>([])

  const fetchTransfers = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })
      
      const response = await fetch(`/api/transfers?${params}`)
      const data = await response.json()
      setTransfers(data.transfers || [])
    } catch (error) {
      console.error("Failed to fetch transfers:", error)
      setTransfers([])
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
    fetchTransfers()
  }, [filters])

  const updateTransferStatus = async (transferId: string, status: string) => {
    try {
      const response = await fetch("/api/transfers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transferId, status })
      })
      if (response.ok) {
        fetchTransfers()
      }
    } catch (error) {
      console.error("Failed to update transfer status:", error)
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      DRAFT: "secondary",
      WAITING: "warning",
      READY: "default",
      DONE: "success",
      CANCELLED: "destructive",
    }
    return variants[status] || "secondary"
  }

  const getNextStatus = (currentStatus: string) => {
    const transitions: Record<string, string> = {
      DRAFT: "WAITING",
      WAITING: "READY",
      READY: "DONE",
    }
    return transitions[currentStatus]
  }

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || 'Unknown Location'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Internal Transfers</h1>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Create Transfer
        </Button>
      </div>
      
      <TransferForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchTransfers} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <FilterPanel onFilter={setFilters} type="transfers" />
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline">Total: {transfers.length}</Badge>
              <Badge variant="secondary">Draft: {transfers.filter(t => t.status === 'DRAFT').length}</Badge>
              <Badge variant="warning">Waiting: {transfers.filter(t => t.status === 'WAITING').length}</Badge>
              <Badge variant="success">Done: {transfers.filter(t => t.status === 'DONE').length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading transfers...</p>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8">
              <ArrowRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transfers found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{transfer.transferNo}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{getLocationName(transfer.fromLocationId)}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{getLocationName(transfer.toLocationId)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(transfer.status)}>
                        {transfer.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {getNextStatus(transfer.status) && (
                          <Button 
                            size="sm" 
                            onClick={() => updateTransferStatus(transfer.id, getNextStatus(transfer.status))}
                          >
                            {getNextStatus(transfer.status) === "WAITING" ? "Submit" : 
                             getNextStatus(transfer.status) === "READY" ? "Approve" : "Complete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{transfer.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Quantity</p>
                      <p className="font-medium">
                        {transfer.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transfer Date</p>
                      <p className="font-medium">{new Date(transfer.transferDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {transfer.notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {transfer.notes}
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
