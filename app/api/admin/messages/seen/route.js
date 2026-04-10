import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await connectDB();

    const { id } = await req.json();

    const message = await Contact.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // 🔥 toggle logic
    message.isRead = !message.isRead;
    await message.save();

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update seen status" },
      { status: 500 }
    );
  }
}