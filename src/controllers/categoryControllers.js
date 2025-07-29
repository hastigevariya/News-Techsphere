import { categoryValidation, idValidation } from "../models/categoryModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { categoryService } from "../services/categoryService.js";

export const addCategory = async (req, res) => {
    try {
        const image = req.uploadedImages.find(file => file.field === 'image');
        req.body.image = image?.s3Url;
        const { error } = categoryValidation.validate(req.body);
        if (error) {
            return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message, {});
        }
        const newCategory = await categoryService.addCategory(req.body);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.DATA_ADDED, newCategory);
    } catch (error) {
        console.error("Error in addCategory:", error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const getAllCategory = async (req, res) => {
    try {
        const sort = { createdAt: -1 };
        const query = { isActive: true };

        const categories = await categoryService.getAllCategory(query, sort, 0, 100);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.FETCHED, categories);
    } catch (error) {
        console.error("Error in getAllCategory:", error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
};

export const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = idValidation.validate({ id });
        if (error) {
            return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message, {});
        }

        const updated = await categoryService.updateCategoryById(id, req.body);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.UPDATE_BLOG, updated);
    } catch (error) {
        console.error("Error in updateCategoryById:", error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = idValidation.validate({ id });
        if (error) {
            return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message, {});
        }

        await categoryService.deleteCategory(id);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.CAREER_DEACTIVATED, {});
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
};
