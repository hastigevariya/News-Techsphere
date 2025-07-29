import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { dbTableName } from "../utils/constants.js"

const authRegisterSchema = new Schema(
    {
        firstName: { type: String, required: true },
         lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const authModel = model(dbTableName.AUTH, authRegisterSchema);

export const authRegisterValidation = Joi.object({
    firstName: Joi.string().required().messages({
        "string.base": "firstName must be a string",
        "string.empty": "firstName is required",
        "any.required": "firstName is required",
    }),
        lastName: Joi.string().required().messages({
        "string.base": "lastName must be a string",
        "string.empty":"lastName is required",
        "any.required":"lastName is required",
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});

export const authLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});