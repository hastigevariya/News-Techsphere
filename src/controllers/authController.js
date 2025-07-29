import {
    authRegisterValidation,
    authLoginValidation,
} from "../models/authModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { generateJWToken } from "../middleware/auth.js";
import { hash, compare } from "bcrypt";
import { adminService } from "../services/authService.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    const { error } = authRegisterValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const adminExists = await adminService.adminExists({ email: email });
        if (adminExists?.email) {
            return response.error(res, resStatusCode.CONFLICT, resMessage.USER_FOUND, {});
        };
        const hashedPassword = await hash(password, 10);
        req.body.password = hashedPassword;
        const createNewAdmin = await adminService.createAdmin(req.body, hashedPassword);
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.USER_REGISTER, { _id: createNewAdmin._id });
    } catch (error) {
        console.error('Error in register:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { error } = authLoginValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const adminExists = await adminService.adminExists({ email, isActive: true });
        if (!adminExists) {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        const validPassword = await compare(password, adminExists.password);
        if (!validPassword) {
            return response.error(res, resStatusCode.UNAUTHORISED, resMessage.INCORRECT_PASSWORD, {});
        };
        const token = await generateJWToken({ _id: adminExists._id });
        return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, { _id: adminExists._id, token: token });
    } catch (error) {
        console.error('Error in login:', error);
        return response.error(res, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};
