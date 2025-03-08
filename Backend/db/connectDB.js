import mongoose from "mongoose";

export const connectDb=async()=>{

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error ${err.message}`)
    process.exit(1)
  }

}