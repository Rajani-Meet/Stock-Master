"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, CheckCircle } from "lucide-react"

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchReceipts()
  }, [statusFilter])

  const fetchReceipts = async () => {
    try {
      const url = statusFilter === "all" ? "/api/receipts" : `/api/receipts?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      setReceipts(data)
    } catch (error) {
      console.error("Failed to fetch receipts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-muted text-muted-foreground",
      WAITING: "bg-warning/10 text-warning",
      VALIDATED: "bg-success/10 text-success",
      CANCELLED: "bg-destructive/10 text-destructive",
    }
    return colors[status] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Receipt
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex gap-2">
            {["all", "DRAFT", "WAITING", "VALIDATED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 hover:bg-foreground/10"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading receipts...</p>
          ) : receipts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No receipts found</p>
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
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{receipt.items?.length || 0}</p>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
