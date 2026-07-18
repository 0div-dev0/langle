import connectMongo from '@/lib/dbConfig'
import Users from '@/app/models/userModel'
import sendEmail from '@/actions/email'
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { email, token } = await req.json()

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 })
    }

    await connectMongo()

    const user = await Users.findOne({ email, verifyToken: token })
    if (!user) {
      return NextResponse.json({ error: "Invalid token or user not found" }, { status: 400 })
    }

    await sendEmail({ email, token })

    return NextResponse.json({ message: "Verification email sent" })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}