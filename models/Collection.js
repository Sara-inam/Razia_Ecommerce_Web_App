// models/Collection.js
import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  name: { type: String, required: true },  // e.g., "Eid Collection"
  slug: { type: String, required: true, unique: true },
  season: { type: String, enum: ["summer","winter","spring","eid","ramazan"], default:"summer" },
 
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);