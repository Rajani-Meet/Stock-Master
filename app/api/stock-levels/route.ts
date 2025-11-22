import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const locationId = searchParams.get("locationId")
    const productId = searchParams.get("productId")

    const where: any = {}
    if (warehouseId) where.warehouseId = warehouseId
    if (locationId) where.locationId = locationId
    if (productId) where.productId = productId

    const stockLevels = await db.stockLevel.findMany({
      where,
      include: {
        product: { include: { category: true } },
        location: true,
        warehouse: true,
      },
      orderBy: { quantity: "asc" },
    })

    return NextResponse.json(stockLevels)
  } catch (error) {
    console.error("Get stock levels error:", error)
    return NextResponse.json({ error: "Failed to fetch stock levels" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { warehouseId, locationId, productId, quantity } = body

    if (!warehouseId || !locationId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const stockLevel = await db.stockLevel.create({
      data: {
        warehouseId,
        locationId,
        productId,
        quantity: quantity || 0,
        availableQuantity: quantity || 0,
      },
      include: { product: true, location: true, warehouse: true },
    })

    return NextResponse.json(stockLevel, { status: 201 })
  } catch (error: any) {
    console.error("Create stock level error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Stock level already exists for this combination" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create stock level" }, { status: 500 })
  }
}
