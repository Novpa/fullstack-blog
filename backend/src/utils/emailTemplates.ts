export const otpEmailTemplate = (otp: string, fullName: string) => {
  return {
    subject: "Verify Your Email - OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello, ${fullName}!</h2>
        <p>Thankyou for signing up. Use the OTP below to verify your email:</p>

        <div style="
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
        ">
          <h1 style="
            letter-spacing: 8px;
            color: #333;
            font-size: 36px;
          ">${otp}</h1>
        </div>

        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };
};
