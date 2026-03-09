import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  const { file } = await req.json();

  const uploadRes = await cloudinary.uploader.upload(file, {
    folder: "products"
  });

  return NextResponse.json({ url: uploadRes.secure_url });
}