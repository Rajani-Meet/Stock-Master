import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const isResolved = searchParams.get("isResolved")
    const productId = searchParams.get("productId")

    const where: any = {}
    if (isResolved !== null) where.isResolved = isResolved === "true"
    if (productId) where.productId = productId

    const alerts = await db.alert.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(alerts)
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

export async function PUT(req: NextRequest) {
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
