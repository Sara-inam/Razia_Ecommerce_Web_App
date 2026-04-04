import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.customer?.name || !body.customer?.phone || !body.items?.length) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const orderData = {
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      deliveryCharge: body.deliveryCharge,
      total: body.total,

      // ✅ COD default
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",

      status: "pending",
    };

    const order = await Order.create(orderData);

    return new Response(
      JSON.stringify({ success: true, order }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}