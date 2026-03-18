// app/api/collections/[collection]/subcategories/route.js
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

export async function GET(req, context) {
  await connectDB();

  // Unwrap params
  const params = await context.params; // <- must await
  const collection = params.collection;

  try {
    const subCategories = await Product.distinct(
      "brand.collection.sub_category",
      { "brand.collection.collection_name": { $regex: `^${collection}$`, $options: "i" } }
    );

    return NextResponse.json({ subCategories });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}