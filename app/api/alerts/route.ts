import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const isResolved = searchParams.get("isResolved")
    const warehouseId = searchParams.get("warehouseId")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "20")

    const where: any = {}
    if (isResolved !== null) where.isResolved = isResolved === "true"

    const includeProduct = productId ? { product: true } : {}

    const [alerts, total] = await Promise.all([
      db.alert.findMany({
        where,
        include: includeProduct,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.alert.count({ where }),
    ])

    return NextResponse.json({ alerts, total })
  } catch (error) {
    console.error("Get alerts error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, productId, severity, message } = body

    if (!type || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const alert = await db.alert.create({
      data: {
        type,
        productId,
        severity: severity || "WARNING",
        message,
      },
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error("Create alert error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { alertId } = body

    if (!alertId) {
      return NextResponse.json({ error: "Missing alert ID" }, { status: 400 })
    }

    const alert = await db.alert.update({
      where: { id: alertId },
      data: { isResolved: true, resolvedAt: new Date() },
    })

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}
