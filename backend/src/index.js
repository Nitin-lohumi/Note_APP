import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoute.js";
dotenv.config();
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDB from "../dataBase/Db.js"
import { verifyToken } from "../Middleware/AuthMiddleWare.js";
import noteRoutes from "../routes/noteRoutes.js";
const app = express();
app.use(cors({ origin: "https://note-app-orcin-six.vercel.app", credentials: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "asabcjk@212bcasc",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 5 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite:"none"
        },
    })
);
app.use(cookieParser());
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);

app.use(verifyToken);

app.get("/auth/check", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isLoggedIn: "false" });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ isLoggedIn: "true", user });
    } catch (err) {
        return res.json({ isLoggedIn: "false", error: err });
    }
});


app.use("/api", noteRoutes);

app.get("/", (req, res) => {
    res.json({ msg: "safe route" });
});

app.get("/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
})

app.listen(process.env.PORT, () => {
    console.log("listen in port" + process.env.PORT);
})