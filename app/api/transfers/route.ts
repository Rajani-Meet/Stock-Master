import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const where: any = {}
    if (status) where.status = status

    const transfers = await db.internalTransfer.findMany({
      where,
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(transfers)
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
      include: { items: { include: { product: true } } },
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
    const { transferId, status } = body

    if (!transferId) {
      return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 })
    }

    if (status === "DONE") {
      const transfer = await db.internalTransfer.findUnique({
        where: { id: transferId },
        include: {
          items: true,
        },
      })

      if (!transfer) {
        return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
      }

      // Create movements for both from and to locations
      const movements = [
        ...transfer.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantityRequested,
          type: "TRANSFER_OUT" as const,
          locationId: transfer.fromLocationId,
          referenceId: transferId,
          notes: `Transfer out to another location`,
        })),
        ...transfer.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantityRequested,
          type: "TRANSFER_IN" as const,
          locationId: transfer.toLocationId,
          referenceId: transferId,
          notes: `Transfer in from another location`,
        })),
      ]

      await executeStockMovement(movements)
    }

    const result = await db.internalTransfer.update({
      where: { id: transferId },
      data: { status },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update transfer error:", error)
    return NextResponse.json({ error: "Failed to update transfer" }, { status: 500 })
  }
}
