import { authModel } from "../models/authModel.js";

export class adminService {
    static async adminExists(data) {
        try {
            const userExists = await authModel.findOne(data);
            return (userExists);
        } catch (error) {
            return (error);
        };
    };

    static async createAdmin(data) {
        try {
            const createNewAdmin = await authModel.create({
                ...data
            });
            return (createNewAdmin);
        } catch (error) {
            return (error);
        };
    };
}
