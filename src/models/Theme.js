import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Theme:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the theme
 *         name:
 *           type: string
 *           description: The theme name
 *         permissions:
 *           type: object
 *           properties:
 *             images:
 *               type: boolean
 *               description: Whether the theme allows images
 *             videos:
 *               type: boolean
 *               description: Whether the theme allows videos
 *             texts:
 *               type: boolean
 *               description: Whether the theme allows texts
 *       example:
 *         _id: 60c72b2f4f1a2c001c8d4e2b
 *         name: Dark Theme
 *         permissions:
 *           images: true
 *           videos: false
 *           texts: true
 */

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
