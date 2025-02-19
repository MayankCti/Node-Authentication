import os from "os";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import { createUser } from "../models/userModel.js";

export const createNewUser = async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.json({ message: "User created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to get the local IP address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost"; // Fallback to localhost if no external IP is found
};

export const getUsers = (req, res) => {
  const localIp = getLocalIp(); // Get the server's local IP address
  const baseUrl = `http://${localIp}:${process.env.PORT}`;

  db.query(
    "SELECT id, name, email, profile_picture FROM users",
    (err, users) => {
      if (err) return res.status(500).json({ error: err.message });

      if (users?.length) {
        // Modify profile_picture field to include full URL
        users = users.map((user) => ({
          ...user,
          profile_picture: user.profile_picture
            ? `${baseUrl + user.profile_picture}`
            : null,
        }));

        res.json({ data: users, success: true });
      } else {
        res.json({ data: [], success: false });
      }
    }
  );
};

// Update Profile
export const updateUser = (req, res) => {
  const { name } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
  console.log({ name, profilePicture, req });
  db.query(
    "UPDATE users SET name = ?, profile_picture = ? WHERE id = ?",
    [name, profilePicture, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );
};

// Delete User
export const deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.user.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted" });
  });
};

// Change Password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  db.query(
    "SELECT password FROM users WHERE id = ?",
    [req.user.userId],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!(await bcrypt.compare(oldPassword, rows[0].password))) {
        return res.status(400).json({ error: "Incorrect old password" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedNewPassword, req.user.userId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Password changed successfully" });
        }
      );
    }
  );
};
