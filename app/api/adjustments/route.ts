import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const adjustments = await db.stockAdjustment.findMany({
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(adjustments)
  } catch (error) {
    console.error("Get adjustments error:", error)
    return NextResponse.json({ error: "Failed to fetch adjustments" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, locationId, adjustmentDate, reason, items, notes } = body

    if (!type || !locationId || !items?.length || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adjustmentNo = `ADJ-${Date.now()}`

    // Process stock movements
    const movements = items.map((item: any) => ({
      productId: item.productId,
      quantity: Math.abs(item.adjustedQty - item.currentQty),
      type: item.adjustedQty > item.currentQty ? ("ADJUSTMENT_PLUS" as const) : ("ADJUSTMENT_MINUS" as const),
      locationId,
      referenceId: adjustmentNo,
      notes: `${reason}: ${notes || ""}`,
    }))

    await executeStockMovement(movements)

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
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(adjustment, { status: 201 })
  } catch (error) {
    console.error("Create adjustment error:", error)
    return NextResponse.json({ error: "Failed to create adjustment" }, { status: 500 })
  }
}
