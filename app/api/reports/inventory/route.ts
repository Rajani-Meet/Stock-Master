import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { sendReportEmail } from "@/lib/email"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const categoryId = searchParams.get("categoryId")
    const sendEmail = searchParams.get("sendEmail") === 'true'

    const where: any = {}
    if (warehouseId) where.warehouseId = warehouseId
    if (categoryId) where.product = { categoryId }

    const stockLevels = await db.stockLevel.findMany({
      where,
      include: {
        product: { include: { category: true } },
        warehouse: true,
        location: true
      }
    })

    const totalValue = stockLevels.reduce((sum, sl) => sum + (sl.quantity * 10), 0) // Assuming avg price 10
    const lowStockCount = stockLevels.filter(sl => sl.quantity <= sl.product.minStockLevel).length
    const outOfStockCount = stockLevels.filter(sl => sl.quantity === 0).length

    const reportData = {
      summary: {
        totalProducts: stockLevels.length,
        totalValue,
        lowStockCount,
        outOfStockCount
      },
      details: stockLevels
    }

    if (sendEmail) {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        const user = await db.user.findUnique({ where: { id: currentUser.userId } })
        if (user) {
          await sendReportEmail(user.email, 'Inventory', reportData)
        }
      }
    }

    return NextResponse.json({ ...reportData, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate inventory report" }, { status: 500 })
  }
}