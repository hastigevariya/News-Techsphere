import express from "express";
import { addCategory, getAllCategory, updateCategoryById, deleteCategory} from "../controllers/categoryControllers.js";
import { validateAccessToken } from "../middleware/auth.js";
import { categoryImageUpload } from "../utils/multer.js";

const router = express.Router();

router.post("/addCategory", validateAccessToken,categoryImageUpload,addCategory);
router.get("/getAllCategory", getAllCategory);
router.put("/updateCategoryById/:id", updateCategoryById);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
