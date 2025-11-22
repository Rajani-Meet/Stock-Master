"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, CheckCircle, Package, ArrowLeft, Key } from "lucide-react"
import Link from "next/link"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "success">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      
      if (response.ok) {
        setStep("otp")
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      })

      const data = await response.json()
      
      if (response.ok) {
        setStep("success")
      } else {
        setError(data.error || "Failed to reset password")
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
        <Link href="/login" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reset Password
          </h1>
          <p className="text-white/80">Recover access to your account</p>
        </div>

        <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {step === "email" ? "Reset Password" : step === "otp" ? "Verify OTP" : "Success!"}
            </CardTitle>
            <p className="text-gray-600">
              {step === "email" ? "Enter your email to receive OTP" : step === "otp" ? "Enter the code and new password" : "Password reset completed"}
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Send OTP Code
                  </div>
                )}
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="h-14 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200 text-center text-lg tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the OTP code
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting Password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </div>
                )}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Back to Email
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
                <p className="text-gray-600">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Continue to Login
                </Button>
              </Link>
            </div>
          )}
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-white/60 mt-8">
          © 2024 StockMaster. Secure password recovery.
        </p>
      </div>
    </div>
  )
}