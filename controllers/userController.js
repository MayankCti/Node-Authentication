import os from "os";
import argon2 from "argon2";
import db from "../config/db.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserData,
  fetchUserPassword,
  updatePassword,
} from "../models/userModel.js";

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

// Get all user
export const getUsers = async (req, res) => {
  const localIp = getLocalIp(); // Get the server's local IP address
  const baseUrl = `http://${localIp}:${process.env.PORT}`;

  const users = await getAllUsers();

  if (users?.length) {
    // Modify profile_picture field to include full URL
    const response = users.map((user) => ({
      ...user,
      profile_picture: user.profile_picture
        ? `${baseUrl + user.profile_picture}`
        : null,
    }));

    return res.json({ data: response, success: true });
  } else {
    return res.json({ data: [], success: false });
  }
};

// Get User by ID
export const getUser = async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  return res.json({ data: user, success: true });
};

// Update Profile
export const updateUser = async (req, res) => {
  const { name } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  const user = await getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const userName = name || user?.name;
  const userProfilePicture = profilePicture || user?.profile_picture;

  const response = await updateUserData(user, userName, userProfilePicture);

  if (response?.affectedRows > 0) {
    return res.json({ message: "Profile updated successfully" });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID is required", success: false });
    }

    const user = await getUserById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const response = await deleteUserById(id);
    if (response && response.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "User deleted successfully", success: true });
    } else {
      return res
        .status(500)
        .json({ message: "Unable to delete user", success: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Change Password Function
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required",
        success: false,
      });
    }

    // Fetch user's current password
    const user = await fetchUserPassword(userId);
    if (!user || !user.password) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Verify old password
    const isMatch = await argon2.verify(user.password, oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password", success: false });
    }

    // Hash the new password
    const hashedNewPassword = await argon2.hash(newPassword);

    // Update password in database
    const response = await updatePassword(hashedNewPassword, newPassword,userId);

    if (response?.affectedRows > 0) {
      return res.json({
        message: "Password changed successfully",
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Unable to change password",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
