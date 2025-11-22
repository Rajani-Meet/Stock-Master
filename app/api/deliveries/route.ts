import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status) where.status = status

    const deliveries = await db.deliveryOrder.findMany({
      where,
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(deliveries)
  } catch (error) {
    console.error("Get deliveries error:", error)
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, warehouseId, deliveryDate, items, notes } = body

    if (!customerName || !warehouseId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const deliveryNo = `DEL-${Date.now()}`

    const delivery = await db.deliveryOrder.create({
      data: {
        deliveryNo,
        customerName,
        warehouseId,
        deliveryDate: new Date(deliveryDate),
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantityOrdered: item.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(delivery, { status: 201 })
  } catch (error) {
    console.error("Create delivery error:", error)
    return NextResponse.json({ error: "Failed to create delivery" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { deliveryId, status } = body

    if (!deliveryId) {
      return NextResponse.json({ error: "Missing delivery ID" }, { status: 400 })
    }

    if (status === "DONE") {
      // Process stock movements
      const delivery = await db.deliveryOrder.findUnique({
        where: { id: deliveryId },
        include: { items: true },
      })

      if (!delivery) {
        return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
      }

      const location = await db.location.findFirst({
        where: { warehouseId: delivery.warehouseId },
      })

      if (!location) {
        return NextResponse.json({ error: "No location found for warehouse" }, { status: 400 })
      }

      const movements = delivery.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantityOrdered,
        type: "DELIVERY" as const,
        locationId: location.id,
        referenceId: deliveryId,
        notes: `Delivery completion for customer`,
      }))

      await executeStockMovement(movements)
    }

    const result = await db.deliveryOrder.update({
      where: { id: deliveryId },
      data: { status },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update delivery error:", error)
    return NextResponse.json({ error: "Failed to update delivery" }, { status: 500 })
  }
}
