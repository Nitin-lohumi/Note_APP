import express from "express";
import {
    signupOtp,
    verifySignupOTP,
    loginOtp,
    verifyLoginOTP,
} from "../Controllers/AuthController.js";
const router = express.Router();
router.post("/signup/otp", signupOtp);
router.post("/signup/verify", verifySignupOTP);
router.post("/login/otp", loginOtp);
router.post("/login/verify", verifyLoginOTP);

export default router;
