import { db } from "@/lib/db"
import { generateOTP } from "@/lib/auth"
import { sendOTP } from "@/lib/email"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const otpCode = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await db.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpires }
    })

    if (process.env.NODE_ENV === 'production') {
      await sendOTP(email, otpCode)
    } else {
      console.log(`OTP for ${email}: ${otpCode}`)
    }

    return NextResponse.json({ message: "OTP sent to email" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}