import 'dotenv/config'; // automatically loads .env.local
import mongoose from "mongoose";
import Collection from "./models/Collection.js";
import { connectDB } from "./lib/db.js"; // make sure relative path is correct

async function dropSlugIndex() {
  await connectDB();

  try {
    await Collection.collection.dropIndex("slug_1");
    console.log("✅ slug index removed successfully");
  } catch (err) {
    console.log("⚠ Index not found or already removed");
  }

  process.exit();
}

dropSlugIndex();