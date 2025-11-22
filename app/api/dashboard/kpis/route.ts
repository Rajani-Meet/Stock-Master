import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const dateFilter = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) dateFilter.createdAt.gte = new Date(dateFrom)
      if (dateTo) dateFilter.createdAt.lte = new Date(dateTo)
    }

    // Get total products and inventory value
    const stockLevels = await db.stockLevel.findMany({
      where: warehouseId ? { warehouseId } : {},
      include: { product: true },
    })

    const totalProducts = stockLevels.filter(sl => sl.quantity > 0).length
    const totalInventoryValue = stockLevels.reduce((sum, sl) => sum + (sl.quantity * 10), 0) // Assuming avg price
    const lowStockItems = stockLevels.filter((sl) => sl.quantity > 0 && sl.quantity <= (sl.product.minStockLevel || 10)).length
    const outOfStockItems = stockLevels.filter((sl) => sl.quantity === 0).length

    // Get pending documents count
    const [pendingReceipts, pendingDeliveries, scheduledTransfers] = await Promise.all([
      db.receipt.count({ where: { status: { in: ["DRAFT", "WAITING"] } } }),
      db.deliveryOrder.count({ where: { status: { in: ["DRAFT", "READY"] } } }),
      db.internalTransfer.count({ where: { status: { in: ["DRAFT", "WAITING"] } } }),
    ])

    // Get recent alerts - disabled until schema is updated
    const recentAlerts = []

    // Get stock movement summary (last 30 days or custom range)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const moveFilter = {
      createdAt: dateFrom || dateTo ? dateFilter.createdAt : { gte: thirtyDaysAgo },
      ...(warehouseId && { location: { warehouseId } })
    }

    const [recentMoves, dailyMovements] = await Promise.all([
      db.stockMove.groupBy({
        by: ["moveType"],
        where: moveFilter,
        _count: true,
        _sum: { quantity: true }
      }),
      db.stockMove.findMany({
        where: moveFilter,
        select: {
          createdAt: true,
          moveType: true,
          quantity: true
        },
        orderBy: { createdAt: "desc" },
        take: 100
      })
    ])

    // Calculate performance metrics
    const totalMovements = recentMoves.reduce((sum, move) => sum + move._count, 0)
    const inboundMovements = recentMoves
      .filter(m => ["RECEIPT", "TRANSFER_IN", "ADJUSTMENT_PLUS"].includes(m.moveType))
      .reduce((sum, move) => sum + move._count, 0)
    const outboundMovements = recentMoves
      .filter(m => ["DELIVERY", "TRANSFER_OUT", "ADJUSTMENT_MINUS"].includes(m.moveType))
      .reduce((sum, move) => sum + move._count, 0)

    // Group daily movements for trend analysis
    const movementTrends = dailyMovements.reduce((acc, move) => {
      const date = move.createdAt.toISOString().split('T')[0]
      if (!acc[date]) acc[date] = { inbound: 0, outbound: 0 }
      if (["RECEIPT", "TRANSFER_IN", "ADJUSTMENT_PLUS"].includes(move.moveType)) {
        acc[date].inbound += move.quantity
      } else {
        acc[date].outbound += move.quantity
      }
      return acc
    }, {})

    return NextResponse.json({
      inventory: {
        totalProducts,
        totalInventoryValue,
        lowStockItems,
        outOfStockItems
      },
      operations: {
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers,
        totalMovements,
        inboundMovements,
        outboundMovements
      },
      alerts: recentAlerts,
      trends: {
        stockMovementSummary: recentMoves,
        dailyMovements: Object.entries(movementTrends).map(([date, data]) => ({
          date,
          ...data
        })).slice(-7) // Last 7 days
      }
    })
  } catch (error) {
    console.error("Get KPIs error:", error)
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 })
  }
}
