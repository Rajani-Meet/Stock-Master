import { db } from "@/lib/db"
import { executeStockMovement, unreserveStock } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const warehouseId = searchParams.get("warehouseId")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const where: any = {}
    if (status) where.status = status
    if (warehouseId) where.warehouseId = warehouseId

    const [deliveries, total] = await Promise.all([
      db.deliveryOrder.findMany({
        where,
        include: {
          items: { include: { product: true } },
          warehouse: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.deliveryOrder.count({ where }),
    ])

    return NextResponse.json({ deliveries, total })
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
      include: { items: { include: { product: true } }, warehouse: true },
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
    const { deliveryId, status, userId } = body

    if (!deliveryId || !userId) {
      return NextResponse.json({ error: "Missing delivery ID or user ID" }, { status: 400 })
    }

    const delivery = await db.deliveryOrder.findUnique({
      where: { id: deliveryId },
      include: { items: true, warehouse: true },
    })

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    if (status === "DONE") {
      // Get stock locations and create deliveries
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
        referenceType: "Delivery",
        notes: `Delivery: ${delivery.deliveryNo}`,
      }))

      await executeStockMovement(movements, {
        userId,
        action: "COMPLETE_DELIVERY",
        entityType: "DeliveryOrder",
        entityId: deliveryId,
        details: `Completed delivery ${delivery.deliveryNo}`,
      })

      // Unreserve stock if status was READY
      if (delivery.status === "READY") {
        for (const item of delivery.items) {
          try {
            await unreserveStock(item.productId, location.id, item.quantityOrdered, userId)
          } catch (e) {
            console.error(`Failed to unreserve stock for ${item.productId}`, e)
          }
        }
      }
    }

    const result = await db.deliveryOrder.update({
      where: { id: deliveryId },
      data: { status },
      include: { items: { include: { product: true } }, warehouse: true },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update delivery error:", error)
    return NextResponse.json({ error: "Failed to update delivery" }, { status: 500 })
  }
}
