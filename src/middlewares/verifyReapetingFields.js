import Category from '../models/Category.js';
import Theme from '../models/Theme.js';

export const checkDuplicateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        const category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ message: "Failed! Category name is already in use!" });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: error });
    }
};

export const checkDuplicateTheme = async (req, res, next) => {
    try {
        const { name } = req.body;

        const theme = await Theme.findOne({ name });
        if (theme) {
            return res.status(400).json({ message: "Failed! Theme name is already in use!" });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: error });
    }
};
