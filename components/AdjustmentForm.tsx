"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface AdjustmentFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdjustmentForm({ open, onClose, onSuccess }: AdjustmentFormProps) {
  const [locations, setLocations] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    type: "PHYSICAL_COUNT",
    locationId: "",
    reason: "",
    notes: "",
    items: [{ productId: "", currentQty: 0, adjustedQty: 0 }]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch("/api/locations").then(r => r.json()),
        fetch("/api/products").then(r => r.json())
      ]).then(([l, p]) => {
        setLocations(l.data || [])
        setProducts(p.data || [])
      })
    }
  }, [open])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", currentQty: 0, adjustedQty: 0 }]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...formData.items]
    items[index] = { ...items[index], [field]: value }
    setFormData({ ...formData, items })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        onSuccess()
        onClose()
        setFormData({
          type: "PHYSICAL_COUNT",
          locationId: "",
          reason: "",
          notes: "",
          items: [{ productId: "", currentQty: 0, adjustedQty: 0 }]
        })
      }
    } catch (error) {
      console.error("Failed to create adjustment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Stock Adjustment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHYSICAL_COUNT">Physical Count</SelectItem>
                  <SelectItem value="DAMAGE">Damage</SelectItem>
                  <SelectItem value="LOSS">Loss</SelectItem>
                  <SelectItem value="GAIN">Gain</SelectItem>
                  <SelectItem value="EXPIRY">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Select value={formData.locationId} onValueChange={(value) => setFormData({...formData, locationId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Reason</Label>
            <Input value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Items</Label>
              <Button type="button" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-6">
                  <Select value={item.productId} onValueChange={(value) => updateItem(index, "productId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input type="number" placeholder="Current" value={item.currentQty} onChange={(e) => updateItem(index, "currentQty", +e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Input type="number" placeholder="Adjusted" value={item.adjustedQty} onChange={(e) => updateItem(index, "adjustedQty", +e.target.value)} />
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-medium">{item.adjustedQty - item.currentQty}</span>
                </div>
                <div className="col-span-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => removeItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create Adjustment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}