"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { History, Search, ArrowUpDown } from "lucide-react"

export default function MoveHistoryPage() {
  const [moves, setMoves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchMoves()
  }, [typeFilter])

  const fetchMoves = async () => {
    try {
      const url = typeFilter === "all" ? "/api/stock-moves" : `/api/stock-moves?type=${typeFilter}`
      const response = await fetch(url)
      const data = await response.json()
      setMoves(data.moves || [])
    } catch (error) {
      console.error("Failed to fetch moves:", error)
      setMoves([])
    } finally {
      setLoading(false)
    }
  }

  const getMoveTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      RECEIPT: "bg-green-100 text-green-800",
      DELIVERY: "bg-blue-100 text-blue-800",
      TRANSFER_IN: "bg-purple-100 text-purple-800",
      TRANSFER_OUT: "bg-orange-100 text-orange-800",
      ADJUSTMENT_PLUS: "bg-emerald-100 text-emerald-800",
      ADJUSTMENT_MINUS: "bg-red-100 text-red-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const filteredMoves = moves.filter(move =>
    move.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Move History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement Ledger</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "RECEIPT", "DELIVERY", "TRANSFER_IN", "TRANSFER_OUT", "ADJUSTMENT_PLUS", "ADJUSTMENT_MINUS"].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {type === "all" ? "All" : type.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading move history...</p>
          ) : filteredMoves.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No moves found</p>
          ) : (
            <div className="space-y-3">
              {filteredMoves.map((move) => (
                <div
                  key={move.id}
                  className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowUpDown className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{move.product?.name || "Unknown Product"}</p>
                        <p className="text-sm text-muted-foreground">SKU: {move.product?.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMoveTypeColor(move.moveType)}`}>
                        {move.moveType.replace("_", " ")}
                      </span>
                      <span className="font-bold text-lg">
                        {move.moveType.includes("MINUS") || move.moveType === "DELIVERY" || move.moveType === "TRANSFER_OUT" ? "-" : "+"}
                        {move.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{move.location?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reference</p>
                      <p className="font-medium">{move.referenceType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(move.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Notes</p>
                      <p className="font-medium">{move.notes || "N/A"}</p>
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