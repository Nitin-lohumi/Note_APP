import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
    if (req.session?.user) {
        req.user = req.session.user;
        return next();
    }
    res.clearCookie("connect.sid");
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not Authenticated' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};
export default verifyToken;