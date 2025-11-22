import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")

    // Get total products in stock
    const totalProducts = await db.stockLevel.count({
      where: {
        quantity: { gt: 0 },
        ...(warehouseId && { warehouseId }),
      },
    })

    // Get low/out of stock items
    const stockLevels = await db.stockLevel.findMany({
      where: warehouseId ? { warehouseId } : {},
      include: { product: true },
    })

    const lowStockItems = stockLevels.filter((sl) => sl.quantity <= (sl.product.minStockLevel || 10)).length
    const outOfStockItems = stockLevels.filter((sl) => sl.quantity === 0).length

    // Get pending documents count
    const [pendingReceipts, pendingDeliveries, scheduledTransfers] = await Promise.all([
      db.receipt.count({ where: { status: { in: ["DRAFT", "WAITING"] } } }),
      db.deliveryOrder.count({ where: { status: { in: ["DRAFT", "READY"] } } }),
      db.internalTransfer.count({ where: { status: { in: ["DRAFT", "WAITING"] } } }),
    ])

    // Get recent alerts
    const recentAlerts = await db.alert.findMany({
      where: { isResolved: false },
      include: {},
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    // Get stock movement summary (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentMoves = await db.stockMove.groupBy({
      by: ["moveType"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: true,
    })

    return NextResponse.json({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
      recentAlerts,
      stockMovementSummary: recentMoves,
    })
  } catch (error) {
    console.error("Get KPIs error:", error)
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 })
  }
}
