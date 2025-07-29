import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    DOB: { type: String, required: true },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false }
})
const User = mongoose.model("User", userSchema);
export default User;
