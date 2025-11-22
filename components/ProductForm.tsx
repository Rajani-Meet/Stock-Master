"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ProductForm({ open, onClose, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    unit: "UNIT",
    description: "",
    minStockLevel: 10,
    reorderQty: 50
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.data || []))
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        onSuccess()
        onClose()
        setFormData({ name: "", sku: "", categoryId: "", unit: "UNIT", description: "", minStockLevel: 10, reorderQty: 50 })
      }
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNIT">Unit</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="L">Liter</SelectItem>
                  <SelectItem value="M">Meter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Min Stock</Label>
              <Input type="number" value={formData.minStockLevel} onChange={(e) => setFormData({...formData, minStockLevel: +e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}