export const generateOtp = (): string => {
  // generate 6 digits of random numbers
  return Math.floor(100000 + Math.random() * 900000).toString();
};
