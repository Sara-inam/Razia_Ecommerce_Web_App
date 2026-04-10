import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);

    const formData = await req.formData();
    const phone = formData.get("phone") || "";
    const address = formData.get("address") || "";
    const file = formData.get("image");

    let imageUrl = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const updateData = { phone, address };
    if (imageUrl) updateData.profileImage = imageUrl;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { returnDocument: "after" } // ✅ use modern mongoose syntax
    ).select("-password");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      profileImage: user.profileImage || "/default-user.png",
    });

  } catch (err) {
    console.error("Profile Update Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}