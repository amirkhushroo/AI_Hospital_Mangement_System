/**
 * Generate a secure numeric OTP
 * @param {number} length - OTP length (default: 6)
 * @returns {string}
 */

const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

module.exports = generateOTP;