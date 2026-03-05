import mongoose from "mongoose";
import logger from "../config/logger.js";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,              // Maximum number of connections
      minPoolSize: 2,               // Minimum number of connections
      serverSelectionTimeoutMS: 5000, // Timeout for selecting server
      socketTimeoutMS: 45000,       // Timeout for socket operations
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        logger.info("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        logger.error("❌ MongoDB initial connection failed: " + err.message);
        // Optional: retry once after 2s
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            mongoose.connect(process.env.MONGO_URI, opts)
              .then(resolve)
              .catch(reject);
          }, 2000);
        });
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    logger.error("❌ MongoDB connection failed: " + err.message);
    throw err;
  }
}