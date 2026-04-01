import { transporter } from "../config/nodemailer.config";
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
};
