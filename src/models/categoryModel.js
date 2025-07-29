import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import Joi from "joi";
import { dbTableName } from "../utils/constants.js";

const categorySchema = new Schema({
    categoryName: { type: String, required: true },
    categoryContent: { type: String, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const categoryModel = model(dbTableName.CATEGORY, categorySchema);

export const categoryValidation = Joi.object({
    categoryName: Joi.string().required().messages({
        "string.base": `"categoryName" must be a string`,
        "any.required": `"categoryName" is a required field`,
    }),
    categoryContent: Joi.string().required().messages({
        "string.base": `"categoryContent" must be a string`,
        "any.required": `"categoryContent" is a required field`,
    }),
    image: Joi.string().required().messages({
        "string.base": `"image" must be a string`,
        "any.required": `"image" is a required field`,
    }),
    isActive: Joi.boolean()
});

export const idValidation = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.length': 'ID must be exactly 24 characters long.',
        'string.hex': 'ID must be a valid hex string.',
        'any.required': 'ID is required.'
    }),
});
