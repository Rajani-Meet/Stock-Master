import { hash, compare } from "bcryptjs"
import { cookies } from "next/headers"

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth_token")
  
  if (!authToken) {
    return null
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(authToken.value, "base64").toString())
    return decoded
  } catch {
    return null
  }
}
