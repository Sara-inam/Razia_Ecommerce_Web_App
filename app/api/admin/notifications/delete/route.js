import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  const { id } = await req.json();
  await Notification.findByIdAndDelete(id);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}