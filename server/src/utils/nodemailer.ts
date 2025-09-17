import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../constants/env";

export const sendPasswordResetEmail = async (to: string) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"P2C Health" <${SMTP_USER}>`,
    to,
    subject: "Password Reset Request",
    text: "Click the link below to reset your password:\n\nhttp://example.com/reset-password",
    html: `<p>Click the link below to reset your password:</p><p><a href="http://example.com/reset-password">Reset Password</a></p>`,
  });

  console.log("Message sent: %s", info.messageId);
};
// Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

export default sendPasswordResetEmail;
