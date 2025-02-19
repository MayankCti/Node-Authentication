import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log({
  auth: {
    user: process.env.EMAIL_USER,                                            
    pass: process.env.EMAIL_PASS,
  },
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Account",
    html: `
            <h2>Welcome to Our Platform!</h2>
            <p>Click the button below to verify your account:</p>
            <a href="${verificationLink}" style="background-color:blue; color:white; padding:10px; text-decoration:none; border-radius:5px;">Verify Email</a>
            <p>If you didn't request this, please ignore this email.</p>
        `,
  };

  return transporter.sendMail(mailOptions);
};
