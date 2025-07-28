import User from "../modal/userModal.js";
import jwt from 'jsonwebtoken';
import { sendOTP } from "../utils/sendEmail.js";
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const maxAge = 1000 * 60 * 2;
export const signupOtp = async (req, res) => {
    const { email } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });
    const otp = generateOTP();
    req.session.otp = otp;
    req.session.otpExpiry = Date.now() + 5 * 60 * 1000;
    req.session.email = email;
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email, And Valid for 5 minutes." });
};

export const verifySignupOTP = async (req, res) => {
    const { email, otp, name, DOB } = req.body;
    const sessionOtp = req.session.otp;
    const sessionExpiry = req.session.otpExpiry;

    if (!sessionOtp || !sessionExpiry || !email) {
        return res.status(400).json({ message: "Session expired or missing." });
    }
    if (Date.now() > sessionExpiry || otp !== sessionOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const newUser = new User({ email, name, DOB });
    await newUser.save();

    const userdata = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
    };

    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error ending session" });

        res.clearCookie("connect.sid");
        res.cookie("token", jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn: "1d" }), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            message: "Signup successful",
            user: userdata,
        });
    });
};

export const LoginOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid user" });
    const otp = generateOTP();
    req.session.otpData = {
        email,
        otp,
        expiry: Date.now() + 5 * 60 * 1000
    };
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
};


export const verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    const sessionOtp = req.session.otp;
    const sessionExpiry = req.session.otpExpiry;
    if (!sessionOtp || !sessionExpiry || !email) {
        return res.status(400).json({ message: "Session expired or missing." });
    }
    if (Date.now() > sessionExpiry || otp !== sessionOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    const userdata = {
        id: user._id,
        email: user.email,
        name: user.name,
    };
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error ending session." });
        res.clearCookie("connect.sid");
        res.cookie("token", jwt.sign(userdata, process.env.JWT_SECRET, { expiresIn: "1d" }), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(200).json({
            message: "Login successful",
            user: userdata,
        });
    });
};
