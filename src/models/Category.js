import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - coverImageUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The category name
 *         allowsImages:
 *           type: boolean
 *           description: Whether the category allows images
 *         allowsVideos:
 *           type: boolean
 *           description: Whether the category allows videos
 *         allowsTexts:
 *           type: boolean
 *           description: Whether the category allows texts
 *         coverImageUrl:
 *           type: string
 *           description: The URL of the category cover image
 *       example:
 *         _id: 60c72b2f4f1a2c001c8d4e2b
 *         name: Nature
 *         allowsImages: true
 *         allowsVideos: false
 *         allowsTexts: true
 *         coverImageUrl: /uploads/nature.jpg
 */

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
