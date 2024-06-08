import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    allowsImages: {
      type: Boolean,
      default: false,
    },
    allowsVideos: {
      type: Boolean,
      default: false,
    },
    allowsTexts: {
      type: Boolean,
      default: false,
    },
    coverImageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Category", categorySchema);
