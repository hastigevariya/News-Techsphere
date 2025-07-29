import { categoryModel } from "../models/categoryModel.js";

export const categoryService = {
    addCategory: async (data) => {
        const newCategory = new categoryModel(data);
        return await newCategory.save();
    },

    getAllCategory: async (query, sort, skip, limit) => {
        return await categoryModel.find(query).sort(sort).skip(skip).limit(limit).lean();
    },

    getCategoryById: async (id) => {
        return await categoryModel.findById(id);
    },

    updateCategoryById: async (id, data) => {
        return await categoryModel.findByIdAndUpdate(id, data, { new: true });
    },

    deleteCategory: async (id) => {
        return await categoryModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    },
};
