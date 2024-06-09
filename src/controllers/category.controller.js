import Category from "../models/Category.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, allowsImages, allowsVideos, allowsTexts } = req.body;
      const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : "";

      if (!name || !coverImageUrl)
        return res.status(400).json({ message: "Missing fields" });

      const nameExists = await Category.findOne({ name });

      if (nameExists)
        return res.status(400).json({ message: "Category already exists" });

      const category = new Category({
        name,
        allowsImages,
        allowsVideos,
        allowsTexts,
        coverImageUrl,
      });

      const savedCategory = await category.save();

      return res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
      console.error("Create Category Error: ", error);
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await Category.find();
      return res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Categories Error: ", error);
    }
  }

  async getCategory(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "Missing id" });
      const category = await Category.findOne({ _id: id });
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      return res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Category Error: ", error);
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const { name, allowsImages, allowsVideos, allowsTexts, existingImageUrl } = req.body;
      const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : existingImageUrl;

      if (!id || !name || !coverImageUrl)
        return res.status(400).json({ message: "Missing fields" });

      const foundCategory = await Category.findOne({ _id: id });
      if (!foundCategory)
        return res.status(404).json({ message: "Category not found" });

      const nameExists = await Category.findOne({ name });
      if (nameExists && nameExists._id.toString() !== id)
        return res.status(400).json({ message: "Category already exists" });

      if (req.file && foundCategory.coverImageUrl && foundCategory.coverImageUrl !== existingImageUrl) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          foundCategory.coverImageUrl
        );
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== "ENOENT")
            console.error("Failed to delete old file: ", err);
        });
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        {
          name,
          allowsImages,
          allowsVideos,
          allowsTexts,
          coverImageUrl,
        },
        { new: true }
      );

      if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });

      return res.status(200).json(updatedCategory);
    } catch (error) {
      res.status500.json(error);
      console.error("Update Category Error: ", error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;

      const category = await Category.findById(id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      const imagePath = path.join(__dirname, "..", category.coverImageUrl);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete image: ", err);
        }
      });

      await Category.findByIdAndDelete(id);

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
      console.error("Delete Category Error: ", error);
    }
  }
}

export default new CategoryController();
