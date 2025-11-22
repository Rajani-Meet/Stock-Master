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
        setWarehouses(w || [])
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
    
    // Validation
    if (!formData.supplierName || !formData.warehouseId) {
      alert("Please fill in supplier name and warehouse")
      return
    }
    
    const validItems = formData.items.filter(item => item.productId && item.quantity > 0)
    if (validItems.length === 0) {
      alert("Please add at least one valid item")
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: validItems
        })
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
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create receipt")
      }
    } catch (error) {
      console.error("Failed to create receipt:", error)
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            Create Receipt
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Supplier Name</Label>
              <Input 
                value={formData.supplierName} 
                onChange={(e) => setFormData({...formData, supplierName: e.target.value})} 
                required 
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl"
                placeholder="Enter supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Warehouse</Label>
              <Select value={formData.warehouseId} onValueChange={(value) => setFormData({...formData, warehouseId: value})}>
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl">
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
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Received Date</Label>
            <Input 
              type="date" 
              value={formData.receivedDate} 
              onChange={(e) => setFormData({...formData, receivedDate: e.target.value})} 
              className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl"
            />
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
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-50 border-gray-200">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Receipt"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}