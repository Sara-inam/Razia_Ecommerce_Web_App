import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });

  const { id, title, message, userId, expiresAt } = await req.json();
  const notif = await Notification.findByIdAndUpdate(
    id,
    { title, message, userId: userId || null, expiresAt: expiresAt ? new Date(expiresAt) : undefined },
    { new: true }
  );

  return new Response(JSON.stringify(notif), { status: 200 });
}