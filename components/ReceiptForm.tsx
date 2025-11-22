"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface ReceiptFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ReceiptForm({ open, onClose, onSuccess }: ReceiptFormProps) {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    supplierName: "",
    warehouseId: "",
    receivedDate: new Date().toISOString().split('T')[0],
    notes: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch("/api/warehouses").then(r => r.json()),
        fetch("/api/products").then(r => r.json())
      ]).then(([w, p]) => {
        setWarehouses(w.data || [])
        setProducts(p.data || [])
      })
    }
  }, [open])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: 1, unitPrice: 0 }]
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
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        onSuccess()
        onClose()
        setFormData({
          supplierName: "",
          warehouseId: "",
          receivedDate: new Date().toISOString().split('T')[0],
          notes: "",
          items: [{ productId: "", quantity: 1, unitPrice: 0 }]
        })
      }
    } catch (error) {
      console.error("Failed to create receipt:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Receipt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Supplier Name</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} required />
            </div>
            <div>
              <Label>Warehouse</Label>
              <Select value={formData.warehouseId} onValueChange={(value) => setFormData({...formData, warehouseId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Received Date</Label>
            <Input type="date" value={formData.receivedDate} onChange={(e) => setFormData({...formData, receivedDate: e.target.value})} />
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
                <div className="col-span-5">
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
                  <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", +e.target.value)} />
                </div>
                <div className="col-span-3">
                  <Input type="number" step="0.01" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", +e.target.value)} />
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
            <Button type="submit" disabled={loading}>Create Receipt</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}