import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import {
  canRead,
  canWrite,
  canDelete,
  verifyToken,
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";
import upload from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: The category name
 *               allowsImages:
 *                 type: boolean
 *                 description: Whether the category allows images
 *               allowsVideos:
 *                 type: boolean
 *                 description: Whether the category allows videos
 *               allowsTexts:
 *                 type: boolean
 *                 description: Whether the category allows texts
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The category cover image
 *     responses:
 *       200:
 *         description: The created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The category name
 *               allowsImages:
 *                 type: boolean
 *                 description: Whether the category allows images
 *               allowsVideos:
 *                 type: boolean
 *                 description: Whether the category allows videos
 *               allowsTexts:
 *                 type: boolean
 *                 description: Whether the category allows texts
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The category cover image
 *               existingImageUrl:
 *                 type: string
 *                 description: The existing cover image URL
 *     responses:
 *       200:
 *         description: The updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

router.get("/", CategoryController.getCategories);
router.get(
  "/:id",
  [verifyToken, canRead, mongoId],
  CategoryController.getCategory
);
router.post(
  "/",
  [verifyToken, canWrite, upload.single("file")],
  CategoryController.createCategory
);
router.put(
  "/:id",
  [verifyToken, canWrite, upload.single("file"), mongoId],
  CategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyToken, canDelete, mongoId],
  CategoryController.deleteCategory
);

export default router;
