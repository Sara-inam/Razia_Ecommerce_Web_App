// models/Collection.js
import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  collection_name: { type: String, required: true },  // e.g., "Eid Collection"
  category: {type: String, required: true},
  sub_category: {type: String, required: true }, 
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);