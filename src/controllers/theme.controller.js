import Theme from "../models/Theme.js";

class ThemeController {
  async createTheme(req, res) {
    try {
      const { name, permissions } = req.body;

      if (!name) return res.status(400).json({ message: "Missing fields" });

      const nameExists = await Theme.findOne({ name });

      if (nameExists)
        return res.status(400).json({ message: "Name already exists" });

      const theme = new Theme({
        name,
        permissions: {
          images: permissions?.images || false,
          videos: permissions?.videos || false,
          texts: permissions?.texts || false,
        },
      });

      const savedTheme = await theme.save();

      return res.status(200).json(savedTheme);
    } catch (error) {
      res.status(500).json(error);
      console.error("Create Theme Error: ", error);
    }
  }

  async getThemes(req, res) {
    try {
      const themes = await Theme.find();

      return res.status(200).json(themes);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Themes Error: ", error);
    }
  }

  async getTheme(req, res) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Missing id" });

      const theme = await Theme.findById(id);

      if (!theme) return res.status(404).json({ message: "Theme not found" });

      return res.status(200).json(theme);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Theme Error: ", error);
    }
  }

  async updateTheme(req, res) {
    try {
      const id = req.params.id;
      const { name, permissions } = req.body;

      if (!id || !name)
        return res.status(400).json({ message: "Missing fields" });

      const nameExists = await Theme.findOne({ name });

      if (nameExists && nameExists._id.toString() !== id)
        return res.status(400).json({ message: "Name already exists" });

      const theme = await Theme.findById(id)

      const updatedTheme = await Theme.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            permissions: {
              images: permissions?.images || theme.permissions.images,
              videos: permissions?.videos || theme.permissions.videos,
              texts: permissions?.texts || theme.permissions.texts,
            },
          },
        }
      );

      if (!updatedTheme)
        return res.status(404).json({ message: "Theme not found" });

      return res.status(200).json(updatedTheme);
    } catch (error) {
      res.status(500).json(error);
      console.error("Update Theme Error: ", error);
    }
  }

  async deleteTheme(req, res) {
    try {
      const id = req.params.id;

      if (!id) return res.status(400).json({ message: "Missing id" });

      const theme = await Theme.findById(id);

      if (!theme) return res.status(404).json({ message: "Theme not found" });

      await Theme.findByIdAndDelete(id);

      return res.status(200).json({ message: "Theme deleted" });
    } catch (error) {
      res.status(500).json(error);
      console.error("Delete Theme Error: ", error);
    }
  }
}

export default new ThemeController();
