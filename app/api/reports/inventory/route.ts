import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const categoryId = searchParams.get("categoryId")

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

    return NextResponse.json({
      summary: {
        totalProducts: stockLevels.length,
        totalValue,
        lowStockCount,
        outOfStockCount
      },
      details: stockLevels
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate inventory report" }, { status: 500 })
  }
}