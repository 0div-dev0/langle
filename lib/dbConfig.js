// import mongoose from "mongoose";

// export async function connect() {
//     try {
//         mongoose.connect(process.env.MONGO_URI)
//         const connection = mongoose.connection()
//         connection.on('connected', () => {
//             console.log("CONNECTED TO MONGODB.")
//         })
//         connection.on('error', (err) => {
//             console.error("MONGODB CONNECTION ERROR, PLEASE MAKE SURE DB IS UP AND RUNNING", err)
//             setTimeout(() => process.exit(1), 2000);
//         })
//     } catch (error) {
//         console.log('something went wrong. inestablishing connection')
//         console.log(error)
//     }
// }
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env")

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectMongo() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectMongo