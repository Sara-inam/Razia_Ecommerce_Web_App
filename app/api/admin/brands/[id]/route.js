import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";

// GET single brand
export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;

  // Populate collection to show collection_name
  const brands = await Brand.find().populate("collection");
  if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json(brand);
}

// UPDATE brand
export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;

  const formData = await req.formData();
  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const collection = formData.get("collection"); // ✅ Collection ObjectId
  const file = formData.get("image");

  let updatedData = { brand_name, description, collection }; // Add collection here

  if (file && file.size > 0) {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const dataUri = `data:${mimeType};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "brands",
    });

    updatedData.image = uploadResult.secure_url;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, {
    returnDocument: "after",
  }).populate("collection"); // ✅ Populate collection for frontend

  if (!updatedBrand)
    return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json(updatedBrand);
}

// DELETE brand
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params;

  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json({ message: "Brand deleted successfully" });
}