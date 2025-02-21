import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(cors());

app.use(express.static("public"));
const __dirname = path.resolve(); // Get the root directory

// Serve static files (for HTML pages)
app.use(express.static(path.join(__dirname, "views")));

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
