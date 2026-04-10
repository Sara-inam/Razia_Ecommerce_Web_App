import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";

// ✅ GET SLIDER (ONLY DB DATA)
export async function GET() {
  try {
    await connectDB();

    const slider = await Slider.findOne();

    // ❌ NO AUTO CREATE
    if (!slider) {
      return NextResponse.json({ slides: [] });
    }

    return NextResponse.json(slider);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch slider" },
      { status: 500 }
    );
  }
}