import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      images: {
        type: Boolean,
        default: false,
      },
      videos: {
        type: Boolean,
        default: false,
      },
      texts: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Theme", themeSchema);
