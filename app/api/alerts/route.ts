import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const alerts = await db.alert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 10
    })
    return NextResponse.json({ data: alerts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { type, productId, severity, message } = await req.json()
    const alert = await db.alert.create({
      data: { type, productId, severity, message }
    })
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}