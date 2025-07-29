'use strict'
import { Router } from "express";
import auth from "./authRoutes.js";

const router = Router();
router.use("/auth", auth);

export default router;