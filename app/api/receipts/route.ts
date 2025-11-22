import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const warehouseId = searchParams.get("warehouseId")
    const category = searchParams.get("category")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const where: any = {}
    if (status) where.status = status
    if (warehouseId) where.warehouseId = warehouseId
    if (dateFrom || dateTo) {
      where.receivedDate = {}
      if (dateFrom) where.receivedDate.gte = new Date(dateFrom)
      if (dateTo) where.receivedDate.lte = new Date(dateTo)
    }
    if (category) {
      where.items = {
        some: {
          product: {
            categoryId: category
          }
        }
      }
    }

    const [receipts, total] = await Promise.all([
      db.receipt.findMany({
        where,
        include: {
          items: { include: { product: true } },
          warehouse: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.receipt.count({ where }),
    ])

    return NextResponse.json({ receipts, total })
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
      include: { items: { include: { product: true } }, warehouse: true },
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
    const { receiptId, status, items, userId } = body

    if (!receiptId || !userId) {
      return NextResponse.json({ error: "Missing receipt ID or user ID" }, { status: 400 })
    }

    if (status === "VALIDATED") {
      // Process stock movements
      const receipt = await db.receipt.findUnique({
        where: { id: receiptId },
        include: {
          items: true,
          warehouse: true,
        },
      })

      if (!receipt) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
      }

      // Get default location for warehouse (or use first location)
      const location = await db.location.findFirst({
        where: { warehouseId: receipt.warehouseId },
      })

      if (!location) {
        return NextResponse.json({ error: "No location found for warehouse" }, { status: 400 })
      }

      // Create or update stock levels for each item
      for (const item of receipt.items) {
        const existingStock = await db.stockLevel.findUnique({
          where: {
            warehouseId_locationId_productId: {
              warehouseId: receipt.warehouseId,
              locationId: location.id,
              productId: item.productId,
            },
          },
        })

        if (existingStock) {
          // Update existing stock
          await db.stockLevel.update({
            where: { id: existingStock.id },
            data: {
              quantity: existingStock.quantity + item.quantityOrdered,
              availableQuantity: existingStock.availableQuantity + item.quantityOrdered,
              lastMovedAt: new Date(),
            },
          })
        } else {
          // Create new stock level
          await db.stockLevel.create({
            data: {
              warehouseId: receipt.warehouseId,
              locationId: location.id,
              productId: item.productId,
              quantity: item.quantityOrdered,
              availableQuantity: item.quantityOrdered,
              reservedQuantity: 0,
            },
          })
        }

        // Create stock move record
        await db.stockMove.create({
          data: {
            locationId: location.id,
            productId: item.productId,
            moveType: "RECEIPT",
            quantity: item.quantityOrdered,
            referenceId: receiptId,
            referenceType: "Receipt",
            notes: `Receipt validation: ${receipt.receiptNo}`,
          },
        })
      }

      // Create audit log
      await db.auditLog.create({
        data: {
          userId,
          action: "VALIDATE_RECEIPT",
          entityType: "Receipt",
          entityId: receiptId,
          details: `Validated receipt ${receipt.receiptNo} with ${receipt.items.length} items`,
        },
      })
    }

    const updatedReceipt = await db.receipt.update({
      where: { id: receiptId },
      data: { status },
      include: { items: { include: { product: true } }, warehouse: true },
    })

    return NextResponse.json(updatedReceipt)
  } catch (error) {
    console.error("Update receipt error:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}

