import path from "path";
import dotenv from "dotenv";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../config/mailer.js";
import {
  createUser,
  verifyUserEmail,
  findUserByEmail,
  findUserByActToken,
} from "../models/userModel.js";

dotenv.config();
const __dirname = path.resolve();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await argon2.hash(password);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    await sendVerificationEmail(email, token);
    const userData = {
      name,
      email,
      password: hashedPassword,
      show_password: password,
      act_token: token,
    };
    const response = await createUser(userData);
    if(response.affectedRows > 0){
      res.json({
        message: `Signup successful! Please check your email (${email}) to verify your account.`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await findUserByActToken(token);
    console.log(user);

    if (user?.act_token != token) {
      return res.sendFile(path.join(__dirname, "views", "notverify.html"));
    }
    const data = {
      act_token: "",
      is_verified: 1,
    };

    const result = await verifyUserEmail(
      data?.act_token,
      data?.is_verified,
      user.id
    );

    if (result.affectedRows > 0) {
      return res.sendFile(path.join(__dirname, "views", "verify.html"));
    } else {
      return res.sendFile(path.join(__dirname, "views", "notverify.html"));
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error.", err: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.is_verified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
