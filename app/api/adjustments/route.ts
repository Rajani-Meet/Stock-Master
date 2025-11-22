import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const [adjustments, total] = await Promise.all([
      db.stockAdjustment.findMany({
        include: {
          items: { include: { product: true } },
          location: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.stockAdjustment.count(),
    ])

    return NextResponse.json({ adjustments, total })
  } catch (error) {
    console.error("Get adjustments error:", error)
    return NextResponse.json({ error: "Failed to fetch adjustments" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, locationId, adjustmentDate, reason, items, notes, userId } = body

    if (!type || !locationId || !reason || !items?.length || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adjustmentNo = `ADJ-${Date.now()}`

    // Create adjustment record first
    const adjustment = await db.stockAdjustment.create({
      data: {
        adjustmentNo,
        type,
        locationId,
        adjustmentDate: new Date(adjustmentDate),
        reason,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            currentQty: item.currentQty,
            adjustedQty: item.adjustedQty,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        location: true,
      },
    })

    // Process stock movements
    const movements = items.map((item: any) => {
      const quantity = Math.abs(item.adjustedQty - item.currentQty)
      const isPositive = item.adjustedQty > item.currentQty

      return {
        productId: item.productId,
        quantity,
        type: isPositive ? ("ADJUSTMENT_PLUS" as const) : ("ADJUSTMENT_MINUS" as const),
        locationId,
        referenceId: adjustment.id,
        referenceType: "Adjustment",
        notes: `${reason}: ${isPositive ? "+" : "-"}${quantity}`,
      }
    })

    await executeStockMovement(movements, {
      userId,
      action: "CREATE_ADJUSTMENT",
      entityType: "StockAdjustment",
      entityId: adjustment.id,
      details: `Stock adjustment ${adjustmentNo}: ${reason}`,
      changes: { reason, itemCount: items.length },
    })

    return NextResponse.json(adjustment, { status: 201 })
  } catch (error) {
    console.error("Create adjustment error:", error)
    return NextResponse.json({ error: "Failed to create adjustment" }, { status: 500 })
  }
}
