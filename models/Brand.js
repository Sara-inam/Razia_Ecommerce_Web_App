import mongoose from "mongoose";

const { Schema, model, models, Types } = mongoose;

const BrandSchema = new Schema(
  {
    brand_name: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    collection: { type: Types.ObjectId, ref: "Collection", required: true },
  },
  { timestamps: true, strictPopulate: false  }
);

// ✅ Compound index to allow same brand name in different collections
BrandSchema.index({ brand_name: 1, collection: 1 }, { unique: true });

export default models.Brand || model("Brand", BrandSchema);