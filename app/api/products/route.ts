import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const take = Number.parseInt(searchParams.get("take") || "20")

    const where: any = { isActive: true }
    if (category) where.categoryId = category

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        skip,
        take,
        orderBy: { name: "asc" },
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({
      data: products,
      total,
      pages: Math.ceil(total / take),
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, sku, categoryId, unit, description, minStockLevel, maxStockLevel, reorderQty } = body

    if (!name || !sku || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        name,
        sku,
        categoryId,
        unit,
        description,
        minStockLevel: minStockLevel || 10,
        maxStockLevel,
        reorderQty: reorderQty || 50,
      },
      include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Create product error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
