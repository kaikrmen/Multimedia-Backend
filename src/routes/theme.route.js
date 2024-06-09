import { Router } from "express";
import ThemeController from "../controllers/theme.controller.js";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Theme
 *   description: Theme management
 */

/**
 * @swagger
 * /themes:
 *   get:
 *     summary: Retrieve a list of themes
 *     tags: [Theme]
 *     responses:
 *       200:
 *         description: A list of themes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Theme'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /themes/{id}:
 *   get:
 *     summary: Get a theme by ID
 *     tags: [Theme]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme ID
 *     responses:
 *       200:
 *         description: The theme data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /themes:
 *   post:
 *     summary: Create a new theme
 *     tags: [Theme]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The theme name
 *               permissions:
 *                 type: object
 *                 properties:
 *                   images:
 *                     type: boolean
 *                     description: Whether the theme allows images
 *                   videos:
 *                     type: boolean
 *                     description: Whether the theme allows videos
 *                   texts:
 *                     type: boolean
 *                     description: Whether the theme allows texts
 *     responses:
 *       200:
 *         description: The created theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /themes/{id}:
 *   put:
 *     summary: Update a theme by ID
 *     tags: [Theme]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The theme name
 *               permissions:
 *                 type: object
 *                 properties:
 *                   images:
 *                     type: boolean
 *                     description: Whether the theme allows images
 *                   videos:
 *                     type: boolean
 *                     description: Whether the theme allows videos
 *                   texts:
 *                     type: boolean
 *                     description: Whether the theme allows texts
 *     responses:
 *       200:
 *         description: The updated theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /themes/{id}:
 *   delete:
 *     summary: Delete a theme by ID
 *     tags: [Theme]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme ID
 *     responses:
 *       200:
 *         description: Theme deleted successfully
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Internal server error
 */

router.get("/", ThemeController.getThemes);
router.get("/:id", [verifyToken, mongoId, canRead], ThemeController.getTheme);
router.post("/", [verifyToken, canWrite], ThemeController.createTheme);
router.put(
  "/:id",
  [verifyToken, canWrite, mongoId],
  ThemeController.updateTheme
);
router.delete(
  "/:id",
  [verifyToken, canDelete, mongoId],
  ThemeController.deleteTheme
);

export default router;
