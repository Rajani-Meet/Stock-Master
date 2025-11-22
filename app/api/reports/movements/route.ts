import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const productId = searchParams.get("productId")
    const moveType = searchParams.get("moveType")

    const where: any = {}
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }
    if (productId) where.productId = productId
    if (moveType) where.moveType = moveType

    const movements = await db.stockMove.findMany({
      where,
      include: {
        product: true,
        location: { include: { warehouse: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 1000
    })

    const summary = {
      totalMovements: movements.length,
      inbound: movements.filter(m => ["RECEIPT", "TRANSFER_IN", "ADJUSTMENT_PLUS"].includes(m.moveType)).length,
      outbound: movements.filter(m => ["DELIVERY", "TRANSFER_OUT", "ADJUSTMENT_MINUS"].includes(m.moveType)).length,
      adjustments: movements.filter(m => m.moveType.includes("ADJUSTMENT")).length
    }

    return NextResponse.json({ summary, movements })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate movements report" }, { status: 500 })
  }
}