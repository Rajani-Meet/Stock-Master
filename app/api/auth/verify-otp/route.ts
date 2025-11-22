import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json()
    
    const user = await db.user.findUnique({ where: { email } })
    if (!user || !user.otpCode || !user.otpExpires) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (user.otpCode !== otp || user.otpExpires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)
    
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpires: null
      }
    })

    return NextResponse.json({ message: "Password reset successful" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}