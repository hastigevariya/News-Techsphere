import { Router } from "express";
const router = Router();
import {
    register,
    login,
    // getGoogleOAuthUrl,
    // googleOAuthLogin
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);

// router.get('/getGoogleOAuthUrl', getGoogleOAuthUrl); 
// router.post('/googleOAuthLogin', googleOAuthLogin);

export default router;