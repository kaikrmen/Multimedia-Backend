import Content from "../models/Content.js";
import Theme from "../models/Theme.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class ContentController {
  async createContent(req, res) {
    try {
      const { title, type, text, theme, url, category } = req.body;
      const userId = req.userId;

      if (!title || !type || !theme || !category) {
        return res.status(400).json({ message: "Missing fields" });
      }

      if (!mongoose.Types.ObjectId.isValid(theme) || !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const themeData = await Theme.findById(theme);
      if (!themeData) return res.status(404).json({ message: "Theme not found" });

      const categoryData = await Category.findById(category);
      if (!categoryData) return res.status(404).json({ message: "Category not found" });

      if (
        (type === "image" && !themeData.permissions.images) ||
        (type === "video" && !themeData.permissions.videos) ||
        (type === "text" && !themeData.permissions.texts)
      ) {
        return res.status(400).json({ message: `Theme does not allow ${type} content` });
      }

      let image;
      if (type === "image") {
        if (!req.file) {
          return res.status(400).json({ message: `File is required for ${type} content` });
        }
        image = `/uploads/${req.file.filename}`;
      }

      const content = new Content({
        title,
        type,
        image,
        url: type === "video" ? url : undefined,
        text: type === "text" ? text : undefined,
        theme,
        user: userId,
        category,
      });

      const savedContent = await content.save();
      return res.status(200).json(savedContent);
    } catch (error) {
      res.status(500).json(error);
      console.error("Create Content Error: ", error);
    }
  }

  async getContents(req, res) {
    try {
      const contents = await Content.find().populate("theme user category");
      return res.status(200).json(contents);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Contents Error: ", error);
    }
  }

  async getContent(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const content = await Content.findById(id).populate("theme user category");
      if (!content) return res.status(404).json({ message: "Content not found" });
      return res.status(200).json(content);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Content Error: ", error);
    }
  }

  async updateContent(req, res) {
    try {
      const id = req.params.id;
      const { title, type, text, theme, category } = req.body;

      if (!title || !type || !theme || !category) {
        return res.status(400).json({ message: "Missing fields" });
      }

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(theme) || !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const themeData = await Theme.findById(theme);
      if (!themeData) return res.status(404).json({ message: "Theme not found" });

      const categoryData = await Category.findById(category);
      if (!categoryData) return res.status(404).json({ message: "Category not found" });

      let url;
      if (type === "image" || type === "video") {
        if (req.file) {
          const content = await Content.findById(id);
          if (content.url) {
            const oldFilePath = path.join(__dirname, "..", content.url);
            fs.unlink(oldFilePath, (err) => {
              if (err) console.error("Failed to delete old file: ", err);
            });
          }
          url = `/uploads/${req.file.filename}`;
        }
      }

      const updatedContent = await Content.findByIdAndUpdate(
        id,
        {
          title,
          type,
          url: type !== "text" ? url : undefined,
          text: type === "text" ? text : undefined,
          theme,
          category,
        },
        { new: true }
      );

      if (!updatedContent) return res.status(404).json({ message: "Content not found" });

      return res.status(200).json(updatedContent);
    } catch (error) {
      res.status (500).json(error);
      console.error("Update Content Error: ", error);
    }
  }

  async deleteContent(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const content = await Content.findById(id);
      if (!content) return res.status(404).json({ message: "Content not found" });

      if (content.url) {
        const filePath = path.join(__dirname, "..", content.url);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file: ", err);
        });
      }

      await Content.findByIdAndDelete(id);

      return res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
      console.error("Delete Content Error: ", error);
    }
  }
}

export default new ContentController();
