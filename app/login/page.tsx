"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Package, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("userId", data.user.id)
        router.push("/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6">
      <BackgroundEffects />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            StockMaster
          </h1>
          <p className="text-white/80">Enterprise Inventory Management</p>
        </div>

        <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="h-14 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="h-14 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Access Dashboard
                  </div>
                )}
              </Button>
            </form>
            
            <div className="text-center space-y-4 mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
              <p className="text-sm">
                <Link href="/reset-password" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-4 mt-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Demo Accounts</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-100">
                  <span className="font-medium text-gray-900">Admin</span>
                  <span className="text-gray-600">admin@example.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-100">
                  <span className="font-medium text-gray-900">Manager</span>
                  <span className="text-gray-600">manager@example.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-blue-100">
                  <span className="font-medium text-gray-900">Staff</span>
                  <span className="text-gray-600">staff@example.com</span>
                </div>
                <p className="text-center text-gray-600 mt-3">Password: <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 border border-blue-200">password123</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-white/60 mt-8">
          © 2024 StockMaster. Enterprise-grade inventory management.
        </p>
      </div>
    </div>
  )
}