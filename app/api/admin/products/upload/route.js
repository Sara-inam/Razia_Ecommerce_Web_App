import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/middleware/admin";

export async function POST(req) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { file } = await req.json();

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: "products",
    });

    return NextResponse.json({ url: uploadRes.secure_url }, { status: 200 });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ message: "Upload failed", error: err.message }, { status: 500 });
  }
}