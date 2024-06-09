import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swaggerConfig.js"

// Routes
import routes from "./src/routes/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
app.use(cors());

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

export default app;