import express from "express";
import { upload } from "../config/multer.js";
import { auth } from "../middleware/authMiddleware.js";
import { getUsers, updateUser, deleteUser, changePassword, getUser } from "../controllers/userController.js";

const router = express.Router();

// user crud : 
router.get("/", auth, getUsers);
router.get("/:id", auth, getUser);
router.put("/update", auth, upload.single("profile_picture"), updateUser);
router.delete("/delete/:id", auth, deleteUser);
router.post("/change-password", auth, changePassword);

export default router;
