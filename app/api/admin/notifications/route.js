import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  const notifications = await Notification.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(notifications), { status: 200 });
}