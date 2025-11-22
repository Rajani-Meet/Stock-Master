import { db } from "@/lib/db"
import { executeStockMovement } from "@/lib/stock-engine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const warehouseId = searchParams.get("warehouseId")

    const where: any = {}
    if (status) where.status = status
    if (warehouseId) where.warehouseId = warehouseId

    const receipts = await db.receipt.findMany({
      where,
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(receipts)
  } catch (error) {
    console.error("Get receipts error:", error)
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { supplierName, warehouseId, receivedDate, items, notes } = body

    if (!supplierName || !warehouseId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const receiptNo = `RCP-${Date.now()}`

    const receipt = await db.receipt.create({
      data: {
        receiptNo,
        supplierName,
        warehouseId,
        receivedDate: new Date(receivedDate),
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantityOrdered: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(receipt, { status: 201 })
  } catch (error) {
    console.error("Create receipt error:", error)
    return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { receiptId, status, items } = body

    if (!receiptId) {
      return NextResponse.json({ error: "Missing receipt ID" }, { status: 400 })
    }

    if (status === "VALIDATED") {
      // Process stock movements
      const warehouse = await db.receipt.findUnique({
        where: { id: receiptId },
        include: {
          items: true,
        },
      })

      if (!warehouse) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
      }

      // Get default location for warehouse (or use first location)
      const location = await db.location.findFirst({
        where: { warehouseId: warehouse.warehouseId },
      })

      if (!location) {
        return NextResponse.json({ error: "No location found for warehouse" }, { status: 400 })
      }

      // Create stock movements for each item
      const movements = warehouse.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantityOrdered,
        type: "RECEIPT" as const,
        locationId: location.id,
        referenceId: receiptId,
        notes: `Receipt validation from supplier`,
      }))

      await executeStockMovement(movements)
    }

    const receipt = await db.receipt.update({
      where: { id: receiptId },
      data: { status },
      include: { items: { include: { product: true } } },
    })

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Update receipt error:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}
