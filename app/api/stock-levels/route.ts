import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const locationId = searchParams.get("locationId")
    const productId = searchParams.get("productId")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const where: any = {}
    if (warehouseId) where.warehouseId = warehouseId
    if (locationId) where.locationId = locationId
    if (productId) where.productId = productId

    const [stockLevels, total] = await Promise.all([
      db.stockLevel.findMany({
        where,
        include: {
          product: { include: { category: true } },
          location: true,
          warehouse: true,
        },
        skip,
        take,
        orderBy: { quantity: "asc" },
      }),
      db.stockLevel.count({ where }),
    ])

    return NextResponse.json({ stockLevels, total })
  } catch (error) {
    console.error("Get stock levels error:", error)
    return NextResponse.json({ error: "Failed to fetch stock levels" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { warehouseId, locationId, productId, quantity } = body

    if (!warehouseId || !locationId || !productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const stockLevel = await db.stockLevel.create({
      data: {
        warehouseId,
        locationId,
        productId,
        quantity,
        availableQuantity: quantity,
      },
      include: {
        product: { include: { category: true } },
        location: true,
        warehouse: true,
      },
    })

    return NextResponse.json(stockLevel, { status: 201 })
  } catch (error: any) {
    console.error("Create stock level error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Stock level already exists for this location/product combination" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create stock level" }, { status: 500 })
  }
}
