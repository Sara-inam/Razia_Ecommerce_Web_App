import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params; // ✅ unwrap Promise

  const brand = await Brand.findById(id);
  if (!brand) return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json(brand);
}

export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;

  const formData = await req.formData();
  const brand_name = formData.get("brand_name");
  const description = formData.get("description");
  const file = formData.get("image"); // Web File object

  let updatedData = { brand_name, description };

  if (file && file.size > 0) {
    // Convert File to base64 string
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type; // e.g. "image/png"

    const dataUri = `data:${mimeType};base64,${base64}`;

    // Upload directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "brands",
    });

    updatedData.image = uploadResult.secure_url;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, {
    returnDocument: "after",
  });

  if (!updatedBrand)
    return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json(updatedBrand);
}
export async function DELETE(req, context) {
  await connectDB();
  const { id } = await context.params; // ✅ unwrap Promise

  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json({ message: "Brand not found" }, { status: 404 });

  return NextResponse.json({ message: "Brand deleted successfully" });
}