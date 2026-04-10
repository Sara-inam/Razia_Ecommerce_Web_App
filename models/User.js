import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  profileImage: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
   refreshToken: { type: String }, // ✅ Add this field
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);