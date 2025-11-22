"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 border-border/50 hover:bg-primary/10 hover:border-primary/20 transition-all duration-200"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      )}
    </Button>
  )
}