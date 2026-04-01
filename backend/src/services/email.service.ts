import prismaConfig from "../../prisma.config";
import { transporter } from "../config/nodemailer.config";
import { prisma } from "../config/prisma-client.config";
import { AppError } from "../utils/AppError";
import { otpEmailTemplate } from "../utils/emailTemplates";

export const emailService = {
  sendOtp: async (email: string, otp: string, fullName: string) => {
    const template = otpEmailTemplate(otp, fullName);

    await transporter.sendMail({
      from: `Ibentix <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });
  },

  verifyOtp: async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(404, "user is not found");
    }

    if (user.isVerified) {
      throw new AppError(400, "user already exist");
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError(400, "OTP has expired");
    }

    if (otp !== user.otp) {
      throw new AppError(400, "Email already verified");
    }

    return await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiresAt: null },
    });
  },
};
