import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import Collection from "@/models/Collection";
import cloudinary from "@/lib/cloudinary";

// ✅ GET ALL BRANDS
export async function GET() {
  await connectDB();

  const brands = await Brand.find()
    .populate("collection"); // ✅ lowercase

  return NextResponse.json(brands);
}

// ✅ CREATE BRAND
export async function POST(req) {
  await connectDB();

  const formData = await req.formData();

  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const collection = formData.get("collection");
  const file = formData.get("image");

  let imageUrl = "";

  // Upload image only if exists
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "brands" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    imageUrl = uploadResult.secure_url;
  }

  const newBrand = await Brand.create({
    brand_name,
    description,
    collection, // foreign key
    image: imageUrl,
  });

  // populate before sending to frontend
  const populatedBrand = await Brand.findById(newBrand._id)
    .populate("collection");

  return NextResponse.json(populatedBrand, { status: 201 });
}