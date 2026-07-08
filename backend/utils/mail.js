// import nodemailer from "nodemailer";
// import dns from "dns";

// const PLACEHOLDER_HOSTS = new Set(["smtp.example.com", "localhost", "127.0.0.1"]);
// const PLACEHOLDER_USERS = new Set(["your@email.com", "user@example.com"]);
// const PLACEHOLDER_PASSWORDS = new Set(["your-password", "password", "changeme"]);

// function isSmtpConfigured() {
//   const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
//   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
//   if (PLACEHOLDER_HOSTS.has(SMTP_HOST.toLowerCase())) return false;
//   if (PLACEHOLDER_USERS.has(SMTP_USER.toLowerCase())) return false;
//   if (PLACEHOLDER_PASSWORDS.has(SMTP_PASS)) return false;
//   return true;
// }

// function getTransporter() {
//   if (!isSmtpConfigured()) return null;

//   const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
//   // return nodemailer.createTransport({
//   //   host: SMTP_HOST,
//   //   port: Number(SMTP_PORT) || 587,
//   //   secure: SMTP_SECURE === "true",
//   //   auth: {
//   //     user: SMTP_USER,
//   //     pass: SMTP_PASS,
//   //   },
//   // });

//   dns.setDefaultResultOrder("ipv4first");


//   return nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT) || 587,
//     secure: false,
//     requireTLS: true,
//     family: 4, // Force IPv4
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },
//   });
// }

// function logResetLink(to, resetUrl) {
//   console.log(`[password-reset] Reset link for ${to}: ${resetUrl}`);
// }

// export async function sendPasswordResetEmail({ to, name, resetUrl }) {
//   const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@mgrmmedicare.com";
//   const transporter = getTransporter();

//   if (!transporter) {
//     logResetLink(to, resetUrl);
//     return { delivered: false, logged: true };
//   }

//   try {
//     await transporter.sendMail({
//       from,
//       to,
//       subject: "Reset your MGRM Medicare password",
//       text: `Hi ${name || "there"},\n\nUse this link to reset your password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
//       html: `
//         <p>Hi ${name || "there"},</p>
//         <p>Use the link below to reset your password. This link is valid for 1 hour.</p>
//         <p><a href="${resetUrl}">Reset password</a></p>
//         <p>If you did not request this, you can ignore this email.</p>
//       `,
//     });
//     return { delivered: true };
//   } catch (err) {
//     console.error("[password-reset] Email send failed:", err.message);
//     logResetLink(to, resetUrl);
//     return { delivered: false, logged: true, error: err.message };
//   }
// }



// import nodemailer from "nodemailer";

// const PLACEHOLDER_HOSTS = new Set([
//   "smtp.example.com",
//   "localhost",
//   "127.0.0.1",
// ]);

// const PLACEHOLDER_USERS = new Set([
//   "your@email.com",
//   "user@example.com",
// ]);

// const PLACEHOLDER_PASSWORDS = new Set([
//   "your-password",
//   "password",
//   "changeme",
// ]);

// function isSmtpConfigured() {
//   const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

//   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;

//   if (PLACEHOLDER_HOSTS.has(SMTP_HOST.toLowerCase())) return false;
//   if (PLACEHOLDER_USERS.has(SMTP_USER.toLowerCase())) return false;
//   if (PLACEHOLDER_PASSWORDS.has(SMTP_PASS)) return false;

//   return true;
// }

// function getTransporter() {
//   if (!isSmtpConfigured()) return null;

//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT) || 2525,
//     secure: process.env.SMTP_SECURE === "true",

//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//     logger: true,
// debug: true,

//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//   });
// }

// function logResetLink(to, resetUrl) {
//   console.log(`[password-reset] Reset link for ${to}: ${resetUrl}`);
// }

// export async function sendPasswordResetEmail({
//   to,
//   name,
//   resetUrl,
// }) {
//   const transporter = getTransporter();

//   const from =
//     process.env.SMTP_FROM ||
//     process.env.SMTP_USER ||
//     "noreply@mgrmmedicare.com";

//   if (!transporter) {
//     logResetLink(to, resetUrl);
//     return {
//       delivered: false,
//       logged: true,
//     };
//   }

//   try {
//     await transporter.verify();
//     console.log("✅ SMTP connection verified");

//     const info = await transporter.sendMail({
//       from,
//       to,
//       subject: "Reset your MGRM Medicare password",

//       text: `
// Hi ${name || "there"},

// Use the link below to reset your password.

// ${resetUrl}

// This link is valid for 1 hour.

// If you did not request this, you can ignore this email.
//       `,

//       html: `
//         <p>Hi ${name || "there"},</p>

//         <p>Click below to reset your password.</p>

//         <p>
//           <a href="${resetUrl}">
//             Reset Password
//           </a>
//         </p>

//         <p>This link is valid for <b>1 hour</b>.</p>

//         <p>If you didn't request this, simply ignore this email.</p>
//       `,
//     });

//     console.log("✅ Email sent:", info.messageId);

//     return {
//       delivered: true,
//       messageId: info.messageId,
//     };
//   } catch (err) {
//     console.error("❌ Email send failed:");
//     console.error(err);

//     logResetLink(to, resetUrl);

//     return {
//       delivered: false,
//       logged: true,
//       error: err.message,
//     };
//   }
// }

import nodemailer from "nodemailer";

const PLACEHOLDER_HOSTS = new Set([
  "smtp.example.com",
  "localhost",
  "127.0.0.1",
]);

const PLACEHOLDER_USERS = new Set([
  "your@email.com",
  "user@example.com",
]);

const PLACEHOLDER_PASSWORDS = new Set([
  "your-password",
  "password",
  "changeme",
]);

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

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === "true",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function logResetLink(to, resetUrl) {
  console.log(`[password-reset] Reset link for ${to}: ${resetUrl}`);
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}) {
  const transporter = getTransporter();

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "noreply@mgrmmedicare.com";

  if (!transporter) {
    logResetLink(to, resetUrl);
    return {
      delivered: false,
      logged: true,
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Reset your MGRM Medicare password",

      text: `Hi ${name || "there"},

Use the link below to reset your password.

${resetUrl}

This link is valid for 1 hour.

If you did not request this, you can safely ignore this email.`,

      html: `
        <p>Hi ${name || "there"},</p>

        <p>Click the button below to reset your password.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:#0d6efd;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:600;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          Or copy and paste this link into your browser:
        </p>

        <p>${resetUrl}</p>

        <p>This link will expire in <strong>1 hour</strong>.</p>

        <p>If you didn't request this password reset, you can ignore this email.</p>
      `,
    });

    console.log(`✅ Password reset email sent to ${to}`);
    console.log(`Message ID: ${info.messageId}`);

    return {
      delivered: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error("❌ Password reset email failed:", err.message);

    logResetLink(to, resetUrl);

    return {
      delivered: false,
      logged: true,
      error: err.message,
    };
  }
}

function logEmailFallback(type, to, payload) {
  console.log(`[${type}] Email for ${to}:`, payload);
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter();
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "noreply@mgrmmedicare.com";

  if (!transporter) {
    logEmailFallback("email", to, { subject, text });
    return { delivered: false, logged: true };
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    return { delivered: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email send failed (${subject}):`, err.message);
    logEmailFallback("email", to, { subject, text });
    return { delivered: false, logged: true, error: err.message };
  }
}

export async function sendOrderConfirmationEmail({ to, name, order }) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const orderId = order._id?.toString().slice(-8).toUpperCase() || "—";
  const itemLines = (order.items || [])
    .map((item) => `• ${item.name} × ${item.qty} — ₹${item.lineTotal ?? item.discountPrice * item.qty}`)
    .join("\n");

  const subject = `Order confirmed — MGRM Medicare #${orderId}`;
  const text = `Hi ${name || "there"},

Thank you for your order!

Order #${orderId}
Total: ₹${order.total}
Payment: ${order.paymentMethod} (${order.paymentStatus})

${itemLines}

Delivery address:
${order.address}

Track your orders: ${clientUrl}/orders

— MGRM Medicare`;

  const html = `
    <p>Hi ${name || "there"},</p>
    <p>Thank you for your order with <strong>MGRM Medicare</strong>.</p>
    <p><strong>Order #${orderId}</strong><br/>
    Total: <strong>₹${order.total}</strong><br/>
    Payment: ${order.paymentMethod} (${order.paymentStatus})</p>
    <pre style="font-family:inherit;white-space:pre-wrap">${itemLines}</pre>
    <p><strong>Delivery address:</strong><br/>${order.address}</p>
    <p><a href="${clientUrl}/orders">View your orders</a></p>
  `;

  return sendMail({ to, subject, text, html });
}

export async function sendAbandonedCartEmail({ to, name, items, total }) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const subject = "You left items in your cart — MGRM Medicare";
  const itemLines = (items || [])
    .slice(0, 5)
    .map((item) => `• ${item.name} × ${item.qty}`)
    .join("\n");

  const text = `Hi ${name || "there"},

You still have items waiting in your cart (₹${total}):

${itemLines}

Complete your order: ${clientUrl}/checkout

— MGRM Medicare`;

  const html = `
    <p>Hi ${name || "there"},</p>
    <p>You still have items in your cart (total <strong>₹${total}</strong>):</p>
    <pre style="font-family:inherit;white-space:pre-wrap">${itemLines}</pre>
    <p><a href="${clientUrl}/checkout">Complete your order</a></p>
  `;

  return sendMail({ to, subject, text, html });
}