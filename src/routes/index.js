'use strict'
import { Router } from "express";
import auth from "./authRoutes.js";
import category from "./categoryRoutes.js"

const router = Router();
router.use("/auth", auth);
router.use("/category", category);

export default router;