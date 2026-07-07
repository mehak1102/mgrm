import nodemailer from "nodemailer";

const PLACEHOLDER_HOSTS = new Set(["smtp.example.com", "localhost", "127.0.0.1"]);
const PLACEHOLDER_USERS = new Set(["your@email.com", "user@example.com"]);
const PLACEHOLDER_PASSWORDS = new Set(["your-password", "password", "changeme"]);

function isSmtpConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  if (PLACEHOLDER_HOSTS.has(SMTP_HOST.toLowerCase())) return false;
  if (PLACEHOLDER_USERS.has(SMTP_USER.toLowerCase())) return false;
  if (PLACEHOLDER_PASSWORDS.has(SMTP_PASS)) return false;
  return true;
}

function getTransporter() {
  if (!isSmtpConfigured()) return null;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function logResetLink(to, resetUrl) {
  console.log(`[password-reset] Reset link for ${to}: ${resetUrl}`);
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@mgrmmedicare.com";
  const transporter = getTransporter();

  if (!transporter) {
    logResetLink(to, resetUrl);
    return { delivered: false, logged: true };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "Reset your MGRM Medicare password",
      text: `Hi ${name || "there"},\n\nUse this link to reset your password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <p>Hi ${name || "there"},</p>
        <p>Use the link below to reset your password. This link is valid for 1 hour.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
    return { delivered: true };
  } catch (err) {
    console.error("[password-reset] Email send failed:", err.message);
    logResetLink(to, resetUrl);
    return { delivered: false, logged: true, error: err.message };
  }
}
