export const generateOTP = (): string => {
  // 000000 - 999999 (always 6 chars, leading zero allowed)
  return Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
};
