import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: Number(config.smtpPort),
  secure: config.smtpSecure === "true",
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
  } catch (error) {
    console.error("SMTP connection failed:", error.message);
  }
}

async function sendTestEmail() {
  const info = await transporter.sendMail({
    from: `"ReservaHost" <${config.smtpUser}>`,
    to: config.smtpUser,
    subject: "ReservaHost SMTP test",
    html: "<h1>SMTP working correctly</h1><p>This is a test email.</p>",
  });
  console.log("Email sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

export { verifyEmailConnection, sendTestEmail };