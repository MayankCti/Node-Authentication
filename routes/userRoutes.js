import express from "express";
import { getUsers, updateUser, deleteUser, changePassword } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.put("/update", authenticateToken, upload.single("profile_picture"), updateUser);
router.delete("/delete", authenticateToken, deleteUser);
router.post("/change-password", authenticateToken, changePassword);

export default router;
