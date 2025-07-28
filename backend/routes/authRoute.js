import express from "express";
import {
    signupOtp,
    verifySignupOTP,
    LoginOtp,
    verifyLoginOTP
} from "../Controllers/AuthController.js"
const router = express.Router();
router.post("/signupOtp", signupOtp);
router.post("/signup/verify", verifySignupOTP);
router.post("/loginOtp", LoginOtp);
router.post("/login/verify", verifyLoginOTP);
export default router;
