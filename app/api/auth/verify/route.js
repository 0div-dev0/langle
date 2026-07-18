import connectMongo from '@/lib/dbConfig'
import Users from '../../../models/userModel'

export async function GET(req) {

    await connectMongo()

  const token = req.nextUrl.searchParams.get("token")

  const user = await Users.findOne({
    verifyToken: token,
    verifyTokenExpiry: { $gt: Date.now() }
  })

  if (!user) {
    return Response.json({ error: "Invalid or expired token" })
  }

  await Users.updateOne(
    { _id: user._id },
    {
      $set: { isVerified: true },
      $unset: { verifyToken: "", verifyTokenExpiry: "" }
    }
  )

  return Response.redirect("/play")
}
