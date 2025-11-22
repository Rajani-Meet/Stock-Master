"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, UserPlus, Package, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "WAREHOUSE_STAFF"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/login?message=Account created successfully")
      } else {
        setError(data.error || "Signup failed")
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
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join StockMaster
          </h1>
          <p className="text-white/80">Create your account to get started</p>
        </div>

        <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </CardTitle>
            <p className="text-gray-600">Fill in your details below</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter your full name"
                  className="h-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Enter your email"
                  className="h-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger className="h-12 border-gray-200 bg-gray-50 text-gray-900 focus:border-blue-500 focus:bg-white rounded-xl">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="WAREHOUSE_STAFF" className="text-gray-900">Warehouse Staff</SelectItem>
                    <SelectItem value="MANAGER" className="text-gray-900">Manager</SelectItem>
                    <SelectItem value="ADMIN" className="text-gray-900">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Create a password"
                    className="h-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200 pr-12"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    placeholder="Confirm your password"
                    className="h-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-4 mt-6 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-900">Secure Registration</p>
              </div>
              <p className="text-xs text-green-700">Your data is encrypted and protected with enterprise-grade security.</p>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-white/60 mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}