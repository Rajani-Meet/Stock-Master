import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const locations = await db.location.findMany({
      where: { isActive: true },
      include: { warehouse: true },
      orderBy: { name: "asc" }
    })
    return NextResponse.json({ data: locations })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}