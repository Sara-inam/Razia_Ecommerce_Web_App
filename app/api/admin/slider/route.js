import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // validation (3 slides fix)
    if (!body.slides || body.slides.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 slides required" },
        { status: 400 }
      );
    }

    const updated = await Slider.findOneAndUpdate(
      {},
      { slides: body.slides },
      { new: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 }
    );
  }
}