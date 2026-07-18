// pages/api/auth/signup.js
import connectMongo from '@/lib/dbConfig'
import Users from '../../../models/userModel'
import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server"
import crypto from "crypto";


export async function POST(req) {
  const { email, password } = await req.json()

  await connectMongo()

  const existingUser = await Users.findOne({ email })
  if (existingUser) {
    if(!existingUser.isVerified){
      const deletedUser = await Users.findByIdAndDelete(existingUser._id);
    } else{
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

const token = crypto.randomBytes(32).toString("hex")
  const newUser = await Users.create({ email, password: hashedPassword, isVerified: false, verifyToken: token, verifyTokenExpiry:Date.now() + 1000 * 60 * 60})

  return NextResponse.json(
    {
      message: "User created",
      user: { id: newUser._id, email: newUser.email, token: newUser.verifyToken }
    },
    { status: 201 }
  )
}