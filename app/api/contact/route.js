// app/api/contact/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const newMessage = await Contact.create(body);

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}