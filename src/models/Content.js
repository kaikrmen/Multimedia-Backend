import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - theme
 *         - user
 *         - categoryId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the content
 *         title:
 *           type: string
 *           description: The content title
 *         type:
 *           type: string
 *           enum: ["image", "video", "text"]
 *           description: The content type
 *         image:
 *           type: string
 *           description: The URL of the image content
 *         url:
 *           type: string
 *           description: The URL of the video content
 *         text:
 *           type: string
 *           description: The text content
 *         theme:
 *           type: string
 *           description: The ID of the theme associated with the content
 *         user:
 *           type: string
 *           description: The ID of the user who created the content
 *         categoryId:
 *           type: string
 *           description: The ID of the category associated with the content
 *       example:
 *         _id: 60c72b2f4f1a2c001c8d4e2b
 *         title: My First Content
 *         type: text
 *         text: This is the content of the first post
 *         theme: 60c72b2f4f1a2c001c8d4e2a
 *         user: 60c72b2f4f1a2c001c8d4e29
 *         category: 60c72b2f4f1a2c001c8d4e2c
 */

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },
    image: {
      type: String,
    },
    url: {
      type: String,
    },
    text: {
      type: String,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Content", contentSchema);
