import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(req, context) {
  try {
    await connectDB();

    // ✅ Next.js 13+ fix
    const params = await context.params;
    const id = params.id;

    const body = await req.json();

    console.log("API HIT");
    console.log("ID:", id);
    console.log("STATUS:", body.status);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { returnDocument: "after", runValidators: true } // ⚡ updated per mongoose warning
    );

    if (!updatedOrder) {
      return Response.json({ success: false, error: "Order not found" });
    }

    return Response.json({ success: true, order: updatedOrder });

  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message });
  }
}