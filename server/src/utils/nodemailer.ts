import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../constants/env";

export const sendEmail = async (to: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  let text = "";
  if (subject === "verify") {
    subject = "Email Verification";
    text =
      "Click the link below to verify your email:\n\nhttp://example.com/verify-email";
  } else if (subject === "reset") {
    subject = "Password Reset Request";
    text =
      "Click the link below to reset your password:\n\nhttp://example.com/reset-password";
  }
  const info = await transporter.sendMail({
    from: `"P2C Health" <${SMTP_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          background: #4f46e5;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
          color: #333333;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background: #4f46e5;
          color: #ffffff;
          padding: 12px 20px;
          margin: 20px 0;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          text-align: center;
          padding: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Nodemailer Test</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>To reset your <b>password</b> please press/click the below link</p>
          <a href="https://nodemailer.com" class="button">Reset Password</a>
          <p>If you did not expect this email, you can safely ignore it.</p>
        </div>
        <div class="footer">
          <p>Sent with ❤️ using Nodemailer</p>
        </div>
      </div>
    </body>
  </html>`,
  });

  console.log("Message sent: %s", info.messageId);
};
// Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

export default sendEmail;
