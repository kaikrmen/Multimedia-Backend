import mongoose from "mongoose";

export const role = ["reader", "creator", "admin"];

const rolechema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Role", rolechema);
