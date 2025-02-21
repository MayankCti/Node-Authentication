import db from "../config/db.js";

export const findCategoryByName = (categoryName)=>{
  return new Promise((resolve,reject) => {
    db.query("SELECT * FROM categories WHERE categoryName =?", [categoryName], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
}
export const insertCategory = (data) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO categories SET?", data, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const updatecategoryDetail = (id, name) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE categories SET categoryName = ? WHERE id = ?",
      [name, id],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};
