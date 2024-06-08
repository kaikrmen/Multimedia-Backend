import Category from "../models/Category.js";
import fs from "fs";
import path from "path";

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, allowsImages, allowsVideos, allowsTexts } = req.body;
      const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : "";

      if (!name || !coverImageUrl)
        return res.status(400).json({ message: "Missing fields" });

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
      const { id } = req.params;

      if (!id) return res.status(400).json({ message: "Missing id" });

      const category = await Category.findById(id);

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
      const { id } = req.params;
      const { name, allowsImages, allowsVideos, allowsTexts } = req.body;
      const coverImageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : req.body.coverImageUrl;

      if (!id || !name || !coverImageUrl)
        return res.status(400).json({ message: "Missing fields" });

      const category = await Category.findById(id, {
        name,
        allowsImages,
        allowsVideos,
        allowsTexts,
        coverImageUrl,
      });

      if (!category)
        return res.status(404).json({ message: "Category not found" });

      return res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error);
      console.error("Update Category Error: ", error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      const imagePath = path.join(__dirname, "..", category.coverImageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image: ", err);
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
