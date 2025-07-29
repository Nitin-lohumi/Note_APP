import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import jwt from "jsonwebtoken";

import connectDB from "../dataBase/Db.js";
import authRoutes from "../routes/authRoute.js";
import noteRoutes from "../routes/noteRoutes.js";
import verifyToken from "../Middleware/AuthMiddleWare.js";
dotenv.config();
const app = express();

app.use(cors({
    origin: "https://note-app-one-jet.vercel.app",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 15 * 60,
    }),
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
    },
}));

connectDB();

app.use("/api/auth", authRoutes);

app.use(verifyToken);

app.use("/api", noteRoutes);

app.get("/auth/check", (req, res) => {
    if (req.session?.user) {
        return res.json({ isLoggedIn: "true", user: req.session.user });
    }
    res.clearCookie("connect.sid");
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isLoggedIn: "false" });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(user);
        return res.json({ isLoggedIn: "true", user });
    } catch (err) {
        return res.json({ isLoggedIn: "false", error: err.message });
    }
});

app.get("/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

app.get("/", (req, res) => {
    res.json({ msg: "Safe route" });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
