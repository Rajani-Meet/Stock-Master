"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, BarChart3, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import BackgroundEffects from "@/components/BackgroundEffects"

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track products, stock levels, and locations in real-time"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports", 
      description: "Comprehensive insights and data-driven decisions"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control and audit trails"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant notifications and live stock movements"
    }
  ]

  const stats = [
    { value: "50K+", label: "Products Managed" },
    { value: "25K+", label: "Active Users" },
    { value: "99%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      <BackgroundEffects />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">StockMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8 border border-white/20 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/80">Trusted by 1000+ companies</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Inventory Management
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Made Simple</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Streamline your inventory operations with our enterprise-grade platform. 
            Track stock, manage warehouses, and optimize your supply chain with real-time insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 h-14 px-8 text-lg shadow-2xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14 px-8 text-lg">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/70">Everything you need to manage your inventory efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 mb-8">Join thousands of companies already using StockMaster</p>
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 h-14 px-8 text-lg shadow-2xl">
                  Start Your Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">© 2024 StockMaster. Enterprise-grade inventory management.</p>
        </div>
      </footer>
    </div>
  )
}