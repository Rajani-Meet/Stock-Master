import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const isActive = searchParams.get("isActive")

    const where: any = {}
    if (productId) where.productId = productId
    if (isActive !== null) where.isActive = isActive === "true"

    const rules = await db.reorderRule.findMany({
      where,
      include: {
        product: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error("Get reorder rules error:", error)
    return NextResponse.json({ error: "Failed to fetch reorder rules" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, minLevel, reorderQty } = body

    if (!productId || minLevel === undefined || reorderQty === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const rule = await db.reorderRule.create({
      data: {
        productId,
        minLevel,
        reorderQty,
      },
      include: { product: true },
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error: any) {
    console.error("Create reorder rule error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Reorder rule already exists for this product" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create reorder rule" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { ruleId, minLevel, reorderQty, isActive } = body

    if (!ruleId) {
      return NextResponse.json({ error: "Missing rule ID" }, { status: 400 })
    }

    const rule = await db.reorderRule.update({
      where: { id: ruleId },
      data: {
        ...(minLevel !== undefined && { minLevel }),
        ...(reorderQty !== undefined && { reorderQty }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { product: true },
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Update reorder rule error:", error)
    return NextResponse.json({ error: "Failed to update reorder rule" }, { status: 500 })
  }
}
