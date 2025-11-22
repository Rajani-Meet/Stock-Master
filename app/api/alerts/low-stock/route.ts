import { db } from "@/lib/db"
import { sendLowStockAlert } from "@/lib/email"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Get products with low stock
    const products = await db.product.findMany({
      include: {
        stockLevels: true
      }
    })

    const lowStockProducts = products.filter(product => {
      const totalStock = product.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0)
      return totalStock <= product.minStockLevel
    }).map(product => ({
      name: product.name,
      sku: product.sku,
      currentStock: product.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0),
      minStockLevel: product.minStockLevel
    }))

    if (lowStockProducts.length > 0) {
      // Send alerts to admin and manager users
      const adminUsers = await db.user.findMany({
        where: {
          role: { in: ['ADMIN', 'MANAGER'] },
          isActive: true
        }
      })

      for (const user of adminUsers) {
        await sendLowStockAlert(user.email, lowStockProducts)
      }

      return NextResponse.json({ 
        success: true, 
        message: `Low stock alerts sent for ${lowStockProducts.length} products to ${adminUsers.length} users` 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "No low stock items found" 
    })
  } catch (error) {
    console.error("Failed to send low stock alerts:", error)
    return NextResponse.json({ error: "Failed to send alerts" }, { status: 500 })
  }
}