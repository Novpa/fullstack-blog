import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// nodemailer connection testing
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("💌 Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
};
