import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,              // max active connections
      minPoolSize: 2,               // minimum idle connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,       // IMPORTANT for production (prevents hanging queries)
    };

    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // reset cache on failure
    throw new Error("MongoDB connection failed: " + error.message);
  }
}