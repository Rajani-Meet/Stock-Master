import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const warehouseId = searchParams.get("warehouseId")
    const productId = searchParams.get("productId")
    const categoryId = searchParams.get("categoryId")
    const lowStock = searchParams.get("lowStock")
    const outOfStock = searchParams.get("outOfStock")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {}
    if (warehouseId) where.warehouseId = warehouseId
    if (productId) where.productId = productId
    if (categoryId) where.product = { categoryId }
    if (search) {
      where.OR = [
        { product: { name: { contains: search, mode: "insensitive" } } },
        { product: { sku: { contains: search, mode: "insensitive" } } }
      ]
    }

    let stockLevels = await db.stockLevel.findMany({
      where,
      include: {
        product: { include: { category: true } },
        warehouse: true,
        location: true
      },
      orderBy: { quantity: "asc" },
      skip: (page - 1) * limit,
      take: limit
    })

    if (lowStock === "true") {
      stockLevels = stockLevels.filter(sl => 
        sl.quantity > 0 && sl.quantity <= sl.product.minStockLevel
      )
    }

    if (outOfStock === "true") {
      stockLevels = stockLevels.filter(sl => sl.quantity === 0)
    }

    const total = await db.stockLevel.count({ where })

    return NextResponse.json({ 
      data: stockLevels,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stock levels" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { productId, warehouseId, locationId, quantity, reservedQty = 0 } = await req.json()

    const stockLevel = await db.stockLevel.create({
      data: {
        productId,
        warehouseId,
        locationId,
        quantity,
        reservedQty
      },
      include: {
        product: { include: { category: true } },
        warehouse: true,
        location: true
      }
    })

    return NextResponse.json({ data: stockLevel })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create stock level" }, { status: 500 })
  }
}