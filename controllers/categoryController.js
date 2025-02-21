import {
  findCategoryByName,
  insertCategory,
  updatecategoryDetail,
} from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName)
    return res.status(400).json({ message: "Category name is required" });

  const existingCategory = await findCategoryByName(categoryName);
  if (existingCategory) {
    return res
      .status(400)
      .json({ message: "Category already exists", success: false });
  }

  const response = await insertCategory(req.body);
  if (response.affectedRows > 0) {
    return res.status(201).json({ message: "Category created successfully" });
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required", success: false });
  }
  if (!categoryName)
    return res
      .status(400)
      .json({ message: "Category name is required", success: false });

  const response = await updatecategoryDetail(id, categoryName);

  if (response.affectedRows > 0) {
    return res
      .status(200)
      .json({ message: "Category updated successfully", success: true });
  } else {
    return res
      .status(404)
      .json({ message: "Category not found", success: false });
  }
};
