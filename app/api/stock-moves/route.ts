import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (type && type !== "all") where.moveType = type

    const [moves, total] = await Promise.all([
      db.stockMove.findMany({
        where,
        include: {
          product: true,
          location: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.stockMove.count({ where }),
    ])

    return NextResponse.json({ moves, total })
  } catch (error) {
    console.error("Get stock moves error:", error)
    return NextResponse.json({ error: "Failed to fetch stock moves" }, { status: 500 })
  }
}