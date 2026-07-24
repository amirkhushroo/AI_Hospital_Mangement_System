const twilio = require("twilio");
const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("./emailService");

// ====================== Twilio Client ======================

if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN
) {
  console.warn("Twilio credentials are missing in .env");
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ====================== Normalize Phone ======================

const normalizePhone = (phone) => {
  return String(phone).replace(/\D/g, "").slice(-10);
};

// ====================== SEND OTP ======================

const sendOTP = async ({
  identifier,
  role,
  purpose,
  channel,
}) => {
  try {
    // Delete previous OTP
    await OTP.deleteMany({
      identifier,
      purpose,
    });

    // Generate OTP
    const otp = generateOTP();

    // Expire after 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP
    await OTP.create({
      identifier,
      otp,
      role,
      purpose,
      channel,
      expiresAt,
    });

    // ================= EMAIL =================

    if (channel === "email") {
      await sendEmail({
        to: identifier,
        subject: "MED-CONNECT - OTP Verification",
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h2>OTP Verification</h2>

            <p>Your verification OTP is:</p>

            <h1 style="color:#2563eb;letter-spacing:5px;">
              ${otp}
            </h1>

            <p>
              This OTP is valid for
              <strong>5 minutes</strong>.
            </p>

            <p>Please do not share this OTP.</p>

            <br>

            <p>
              Regards,<br/>
              MED-CONNECT Hospital
            </p>
          </div>
        `,
      });

      console.log("✅ Email OTP sent successfully.");
    }

    // ================= SMS =================

    if (channel === "sms") {

      if (!process.env.TWILIO_PHONE_NUMBER) {
        throw new Error("TWILIO_PHONE_NUMBER is missing in .env");
      }

      const verifiedNumber = process.env.TWILIO_VERIFIED_NUMBER;

      console.log("Identifier :", identifier);
      console.log("Verified   :", verifiedNumber);

      if (
        normalizePhone(identifier) ===
        normalizePhone(verifiedNumber)
      ) {

        // Send SMS only to verified Twilio number
        await client.messages.create({
          body: `Your MED-CONNECT verification code is ${otp}. It is valid for 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${normalizePhone(identifier)}`,
        });

        console.log("✅ SMS OTP sent successfully.");

      } else {

        // Development Mode
        console.log("\n========================================");
        console.log("📱 DEVELOPMENT OTP");
        console.log("Phone :", identifier);
        console.log("OTP   :", otp);
        console.log("========================================\n");

      }
    }

    return {
      success: true,
      message: "OTP sent successfully.",
    };

  } catch (error) {

    console.error("Send OTP Error:", error);

    return {
      success: false,
      message: error.message || "Failed to send OTP.",
    };

  }
};

// ====================== VERIFY OTP ======================

const verifyOTP = async ({
  identifier,
  otp,
  purpose,
}) => {
  try {

    const otpRecord = await OTP.findOne({
      identifier,
      otp,
      purpose,
      verified: false,
    });

    if (!otpRecord) {
      return {
        success: false,
        message: "Invalid OTP.",
      };
    }

    if (otpRecord.expiresAt < new Date()) {
      return {
        success: false,
        message: "OTP has expired.",
      };
    }

    otpRecord.verified = true;

    await otpRecord.save();

    return {
      success: true,
      message: "OTP verified successfully.",
    };

  } catch (error) {

    console.error("Verify OTP Error:", error);

    return {
      success: false,
      message: error.message || "OTP verification failed.",
    };

  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};