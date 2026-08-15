import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Gallery", gallerySchema);
