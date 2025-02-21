import express from "express";
import { signup, login, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup); // signup
router.get("/verify/:token", verifyEmail); // varify user
router.post("/login", login); // login

export default router;
