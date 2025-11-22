"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Shield, User, Settings, Search, Edit, UserX } from "lucide-react"
import UserForm from "@/components/UserForm"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)
  const [filters, setFilters] = useState({ role: "all", isActive: "all", search: "" })

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value)
      })
      
      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()
      setUsers(data.data || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !isActive })
      })
      fetchUsers()
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Shield className="w-4 h-4 text-primary" />
      case "MANAGER": return <Settings className="w-4 h-4 text-accent" />
      default: return <User className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      ADMIN: "destructive",
      MANAGER: "default",
      WAREHOUSE_STAFF: "secondary",
    }
    return variants[role] || "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>
      
      <UserForm 
        open={showForm || !!editUser} 
        onClose={() => { setShowForm(false); setEditUser(null) }} 
        onSuccess={fetchUsers}
        user={editUser}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filters.role} onValueChange={(value) => setFilters({...filters, role: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="WAREHOUSE_STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.isActive} onValueChange={(value) => setFilters({...filters, isActive: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading users...</p>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="p-4 rounded-lg border hover:bg-foreground/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getRoleBadge(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                      <Badge variant={user.isActive ? "success" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={user.isActive ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Login</p>
                      <p className="font-medium">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
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