import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    collection: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Collection",
  required: true
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);