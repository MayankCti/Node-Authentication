import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { createCategory, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

// category crud :
router.post("/create", auth, createCategory);
router.post("/update/:id", auth, updateCategory);

export default router;
