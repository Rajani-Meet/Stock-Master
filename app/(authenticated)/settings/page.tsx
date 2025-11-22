"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [emailReports, setEmailReports] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" />
              </div>
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when stock is low</p>
              </div>
              <Switch checked={lowStockAlerts} onCheckedChange={setLowStockAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Reports</Label>
                <p className="text-sm text-muted-foreground">Receive daily/weekly reports via email</p>
              </div>
              <Switch checked={emailReports} onCheckedChange={setEmailReports} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}