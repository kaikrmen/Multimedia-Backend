import mongoose from "mongoose";

export const role = ["reader", "creator", "admin"];

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The role name
 *       example:
 *         _id: 60c72b2f4f1a2c001c8d4e2b
 *         name: admin
 */

const roleSchema = new mongoose.Schema(
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

export default mongoose.model("Role", roleSchema);
