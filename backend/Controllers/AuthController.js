import User from "../modal/userModal.js";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signupOtp = async (req, res) => {
    const { email } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    req.session.otp = otp;
    req.session.otpExpiry = otpExpiry;
    req.session.email = email;
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email, valid for 5 minutes." });
};

export const verifySignupOTP = async (req, res) => {
    const { email, otp, name, DOB } = req.body;
    if (
        !req.session.otp ||
        !req.session.otpExpiry ||
        req.session.email !== email
    ) {
        return res.status(400).json({ message: "Session expired or invalid." });
    }
    if (Date.now() > req.session.otpExpiry || otp !== req.session.otp) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    const newUser = new User({ name, email, DOB });
    await newUser.save();
    const userPayload = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
    };
    req.session.user = userPayload;
    req.session.cookie.maxAge = 1000 * 60 * 15;
    return res.status(200).json({ message: "singup  successful (Session)", user: userPayload });
};

export const loginOtp = async (req, res) => {
    res.clearCookie("connect.sid");
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    req.session.otp = otp;
    req.session.otpExpiry = otpExpiry;
    req.session.email = email;
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
};

export const verifyLoginOTP = async (req, res) => {
    const { email, otp, keepMeLoggedIn } = req.body;
    console.log(req.session);
    if (
        !req.session.otp ||
        !req.session.otpExpiry ||
        req.session.email !== email
    ) {
        return res.status(400).json({ message: "Session expired or invalid." });
    }
    if (Date.now() > req.session.otpExpiry || otp !== req.session.otp) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const userPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
    };
    delete req.session.otp;
    delete req.session.otpExpiry;
    delete req.session.email;
    if (keepMeLoggedIn) {
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        });
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Session error" });
            res.clearCookie("connect.sid");
            return res.status(200).json({ message: "Login successful (JWT)", user: userPayload });
        });

    } else {
        req.session.user = userPayload;
        req.session.cookie.maxAge = 1000 * 60 * 15;
        return res.status(200).json({ message: "Login successful (Session)", user: userPayload });
    }
};
