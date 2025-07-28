import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: ` <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #333;"> Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">Use the OTP below to continue. This code will expire in <strong>5 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; color: #000; background: #e9ecef; padding: 15px 30px; border-radius: 8px; font-weight: bold;">
            ${otp}
          </span>
        </div>
        <i style="font-size: 14px; color: #888;">If you did not request this, you can safely ignore this email.</i>
      </div>
    </div>`
  });
};
