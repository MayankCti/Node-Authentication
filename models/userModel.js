import db from "../config/db.js";

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users ORDER BY createdAt DESC", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

export const updateUserData = (user, name, profilePicture) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET name = ?, profile_picture = ? WHERE id = ?",
      [name, profilePicture, user.id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};
// Fetch User Password
export const fetchUserPassword = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT password FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null); // Handle case where user is not found
      resolve(result[0]); // Return user password object
    });
  });
};

// Update Password Function
export const updatePassword = (newPassword, show_password, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET password = ? , show_password = ? WHERE id = ?",
      [newPassword, show_password, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result); // Return full result, not just result[0]
      }
    );
  });
};
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO users SET ?", userData, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const verifyUserEmail = (act_token, is_verified, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "Update users set act_token = ?, is_verified = ? where id = ? ",
      [act_token, is_verified, id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

export const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const findUserByActToken = (act_token) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE act_token = ?",
      [act_token],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};
