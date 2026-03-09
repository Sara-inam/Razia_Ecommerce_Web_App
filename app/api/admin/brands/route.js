import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";

// GET all brands
export async function GET() {
  await connectDB();
  const brands = await Brand.find().populate("collection");
  return NextResponse.json(brands);
}

// CREATE brand with Cloudinary image
export async function POST(req) {
  await connectDB();
  const formData = await req.formData();

  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const collection = formData.get("collection"); // ✅ Collection ObjectId from dropdown
  const file = formData.get("image");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "brands" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });

  const newBrand = await Brand.create({
    brand_name,
    description,
    collection, // ✅ Save foreign key
    image: uploadResult.secure_url,
  });

  return NextResponse.json(newBrand, { status: 201 });
}