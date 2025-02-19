import db from "../config/db.js";

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE id = ? AND email = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
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

export const updateUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET ? WHERE id = ?",
      [userData, id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

export const deleteUser = (id) => {
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
