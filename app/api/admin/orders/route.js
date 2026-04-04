import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return Response.json({ success: true, orders });

  } catch (err) {
    return Response.json({ success: false, error: err.message });
  }
}