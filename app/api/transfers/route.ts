import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const where: any = {}
    if (status) where.status = status

    const [transfers, total] = await Promise.all([
      db.internalTransfer.findMany({
        where,
        include: {
          items: { include: { product: true } },
          fromLocation: true,
          toLocation: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.internalTransfer.count({ where }),
    ])

    return NextResponse.json({ transfers, total })
  } catch (error) {
    console.error("Get transfers error:", error)
    return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fromLocationId, toLocationId, transferDate, items, notes } = body

    if (!fromLocationId || !toLocationId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transferNo = `TRF-${Date.now()}`

    const transfer = await db.internalTransfer.create({
      data: {
        transferNo,
        fromLocationId,
        toLocationId,
        transferDate: new Date(transferDate),
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantityRequested: item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        fromLocation: true,
        toLocation: true,
      },
    })

    return NextResponse.json(transfer, { status: 201 })
  } catch (error) {
    console.error("Create transfer error:", error)
    return NextResponse.json({ error: "Failed to create transfer" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { transferId, status, userId } = body

    if (!transferId || !userId) {
      return NextResponse.json({ error: "Missing transfer ID or user ID" }, { status: 400 })
    }

    const transfer = await db.internalTransfer.findUnique({
      where: { id: transferId },
      include: {
        items: true,
        fromLocation: true,
        toLocation: true,
      },
    })

    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
    }

    if (status === "DONE") {
      // Create stock movements: OUT from source, IN to destination
      const outMovements = transfer.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantityRequested,
        type: "TRANSFER_OUT" as const,
        locationId: transfer.fromLocationId,
        referenceId: transferId,
        referenceType: "Transfer",
        notes: `Transfer out: ${transfer.transferNo}`,
      }))

      const inMovements = transfer.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantityRequested,
        type: "TRANSFER_IN" as const,
        locationId: transfer.toLocationId,
        referenceId: transferId,
        referenceType: "Transfer",
        notes: `Transfer in: ${transfer.transferNo}`,
      }))

      await executeStockMovement([...outMovements, ...inMovements], {
        userId,
        action: "COMPLETE_TRANSFER",
        entityType: "InternalTransfer",
        entityId: transferId,
        details: `Completed transfer ${transfer.transferNo} from ${transfer.fromLocation.code} to ${transfer.toLocation.code}`,
      })
    }

    const updated = await db.internalTransfer.update({
      where: { id: transferId },
      data: { status },
      include: {
        items: { include: { product: true } },
        fromLocation: true,
        toLocation: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update transfer error:", error)
    return NextResponse.json({ error: "Failed to update transfer" }, { status: 500 })
  }
}
