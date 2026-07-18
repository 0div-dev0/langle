import connectMongo from '@/lib/dbConfig'
import Users from '@/app/models/userModel'
import sendEmail from '@/actions/email'
import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectMongo()

    const user = await Users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    await Users.updateOne(
      { _id: user._id },
      {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: Date.now() + 1000 * 60 * 60
        }
      }
    )

    await sendEmail({ email, token })

    return NextResponse.json({ message: "Verification email resent" })
  } catch (error) {
    console.error("Resend email error:", error)
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 })
  }
}