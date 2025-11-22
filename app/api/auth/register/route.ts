import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(["WAREHOUSE_STAFF", "MANAGER", "ADMIN"]).default("WAREHOUSE_STAFF"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, password, role } = RegisterSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: await hashPassword(password),
        role,
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entityType: "User",
        entityId: user.id,
        details: `User registered: ${email}`,
      },
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

