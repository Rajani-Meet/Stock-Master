import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const warehouses = await db.warehouse.findMany({
      where: { isActive: true },
      include: {
        locations: { where: { isActive: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error("Get warehouses error:", error)
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, code, address, phone, email } = body

    if (!name || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const warehouse = await db.warehouse.create({
      data: { name, code, address, phone, email },
      include: { locations: true },
    })

    return NextResponse.json(warehouse, { status: 201 })
  } catch (error: any) {
    console.error("Create warehouse error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Warehouse code already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 })
  }
}
