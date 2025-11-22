"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface TransferFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function TransferForm({ open, onClose, onSuccess }: TransferFormProps) {
  const [locations, setLocations] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    fromLocationId: "",
    toLocationId: "",
    transferDate: new Date().toISOString().split('T')[0],
    notes: "",
    items: [{ productId: "", quantity: 1 }]
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
      items: [...formData.items, { productId: "", quantity: 1 }]
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
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        onSuccess()
        onClose()
        setFormData({
          fromLocationId: "",
          toLocationId: "",
          transferDate: new Date().toISOString().split('T')[0],
          notes: "",
          items: [{ productId: "", quantity: 1 }]
        })
      }
    } catch (error) {
      console.error("Failed to create transfer:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Internal Transfer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Location</Label>
              <Select value={formData.fromLocationId} onValueChange={(value) => setFormData({...formData, fromLocationId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select from location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To Location</Label>
              <Select value={formData.toLocationId} onValueChange={(value) => setFormData({...formData, toLocationId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select to location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.filter(l => l.id !== formData.fromLocationId).map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Transfer Date</Label>
            <Input type="date" value={formData.transferDate} onChange={(e) => setFormData({...formData, transferDate: e.target.value})} />
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
                <div className="col-span-8">
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
                <div className="col-span-3">
                  <Input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => updateItem(index, "quantity", +e.target.value)} />
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
            <Input value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create Transfer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}