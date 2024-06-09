import { Router } from "express";
import ContentController from "../controllers/content.controller.js";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";
import upload from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Retrieve a list of contents
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: A list of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contents/{id}:
 *   get:
 *     summary: Get a content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: The content data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Create a new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - theme
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: The content title
 *               type:
 *                 type: string
 *                 enum: ["image", "video", "text"]
 *                 description: The content type
 *               text:
 *                 type: string
 *                 description: The content text (required if type is "text")
 *               theme:
 *                 type: string
 *                 description: The ID of the theme associated with the content
 *               category:
 *                 type: string
 *                 description: The ID of the category associated with the content
 *               url:
 *                 type: string
 *                 description: The URL of the content (required if type is "video")
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The content file (required if type is "image")
 *     responses:
 *       200:
 *         description: The created content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contents/{id}:
 *   put:
 *     summary: Update a content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - theme
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: The content title
 *               type:
 *                 type: string
 *                 enum: ["image", "video", "text"]
 *                 description: The content type
 *               text:
 *                 type: string
 *                 description: The content text (required if type is "text")
 *               theme:
 *                 type: string
 *                 description: The ID of the theme associated with the content
 *               category:
 *                 type: string
 *                 description: The ID of the category associated with the content
 *               url:
 *                 type: string
 *                 description: The URL of the content (required if type is "video")
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The content file (required if type is "image")
 *     responses:
 *       200:
 *         description: The updated content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contents/{id}:
 *   delete:
 *     summary: Delete a content by ID
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */

router.get("/", ContentController.getContents);
router.get(
  "/:id",
  [verifyToken, mongoId, canRead],
  ContentController.getContent
);
router.post(
  "/",
  [verifyToken, canWrite, upload.single("file")],
  ContentController.createContent
);
router.put(
  "/:id",
  [verifyToken, mongoId, canWrite, upload.single("file")],
  ContentController.updateContent
);
router.delete(
  "/:id",
  [verifyToken, mongoId, canDelete],
  ContentController.deleteContent
);

export default router;
