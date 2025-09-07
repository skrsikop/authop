import nodemailer from "nodemailer";

// Function to send emails (OTP, reset password, etc.)
export const sendEmail = async (to, subject, text) => {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",            // Gmail SMTP
      auth: {
        user: process.env.EMAIL_USER,   // Gmail account
        pass: process.env.EMAIL_PASS,   // App password (16-digit)
      },
      tls: {
        rejectUnauthorized: false   // ✅ Allow self-signed certificates for dev
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Auth App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,    // OTP ama message
    });

    console.log(`✅ OTP email sent to: ${to}`);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};
