"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Package, CheckCircle, Eye, Edit } from "lucide-react"
import ReceiptForm from "@/components/ReceiptForm"
import FilterPanel from "@/components/FilterPanel"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [warehouses, setWarehouses] = useState<any[]>([])

  const fetchReceipts = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })
      
      const response = await fetch(`/api/receipts?${params}`)
      const data = await response.json()
      setReceipts(data.receipts || [])
    } catch (error) {
      console.error("Failed to fetch receipts:", error)
      setReceipts([])
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
    fetchReceipts()
  }, [filters])

  const updateReceiptStatus = async (receiptId: string, status: string) => {
    try {
      const response = await fetch("/api/receipts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId, status })
      })
      if (response.ok) {
        fetchReceipts()
      }
    } catch (error) {
      console.error("Failed to update receipt status:", error)
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      DRAFT: "secondary",
      WAITING: "warning",
      VALIDATED: "success",
      CANCELLED: "destructive",
    }
    return variants[status] || "secondary"
  }

  const getNextStatus = (currentStatus: string) => {
    const transitions: Record<string, string> = {
      DRAFT: "WAITING",
      WAITING: "VALIDATED",
    }
    return transitions[currentStatus]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Create Receipt
        </Button>
      </div>
      
      <ReceiptForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchReceipts} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <FilterPanel onFilter={setFilters} type="receipts" />
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline">Total: {receipts.length}</Badge>
              <Badge variant="secondary">Draft: {receipts.filter(r => r.status === 'DRAFT').length}</Badge>
              <Badge variant="warning">Waiting: {receipts.filter(r => r.status === 'WAITING').length}</Badge>
              <Badge variant="success">Validated: {receipts.filter(r => r.status === 'VALIDATED').length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading receipts...</p>
          ) : receipts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No receipts found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{receipt.receiptNo}</p>
                        <p className="text-sm text-muted-foreground">{receipt.supplierName}</p>
                        <p className="text-xs text-muted-foreground">
                          {warehouses.find(w => w.id === receipt.warehouseId)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(receipt.status)}>
                        {receipt.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {getNextStatus(receipt.status) && (
                          <Button 
                            size="sm" 
                            onClick={() => updateReceiptStatus(receipt.id, getNextStatus(receipt.status))}
                          >
                            {getNextStatus(receipt.status) === "WAITING" ? "Submit" : "Validate"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{receipt.items?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-medium">
                        ${receipt.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0).toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Received Date</p>
                      <p className="font-medium">{new Date(receipt.receivedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(receipt.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {receipt.notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {receipt.notes}
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
