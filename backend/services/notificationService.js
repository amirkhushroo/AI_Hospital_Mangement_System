const Notification = require("../models/Notification");
const sendEmail = require("./emailService");
const twilio = require("twilio");

// ====================== Twilio Client ======================

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ====================== Normalize Phone Number ======================

const normalizePhone = (phone) => {
  return String(phone).replace(/\D/g, "").slice(-10);
};

// ====================== Send Notification ======================

const sendNotification = async ({
  userId,
  userModel,
  recipient,
  channel,
  title,
  message,
  type,
  html = "",
  metadata = {},
}) => {
  try {
    // Save notification in database
    const notification = await Notification.create({
      userId,
      userModel,
      title,
      message,
      type,
      channel,
      recipient,
      metadata,
      status: "pending",
    });

    let response = {
      success: false,
    };

    // ====================== EMAIL ======================

    if (channel === "email") {
      response = await sendEmail({
        to: recipient,
        subject: title,
        html,
      });
    }

    // ====================== SMS ======================

    if (channel === "sms") {

      const verifiedNumber = process.env.TWILIO_VERIFIED_NUMBER;

      console.log("Recipient :", recipient);
      console.log("Verified :", verifiedNumber);

      if (
        normalizePhone(recipient) ===
        normalizePhone(verifiedNumber)
      ) {

        try {

          await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${normalizePhone(recipient)}`,
          });

          console.log("✅ SMS sent successfully.");

          response = {
            success: true,
          };

        } catch (err) {

          console.error("Twilio SMS Error:", err);

          response = {
            success: false,
          };

        }

      } else {

        console.log("\n========================================");
        console.log("📱 DEVELOPMENT SMS");
        console.log("Phone   :", recipient);
        console.log("Title   :", title);
        console.log("Message :", message);
        console.log("========================================\n");

        // Development mode
        response = {
          success: true,
        };

      }

    }

    // ====================== Update Status ======================

    notification.status = response.success ? "sent" : "failed";

    await notification.save();

    return {
      success: response.success,
      message: response.success
        ? "Notification sent successfully."
        : "Notification failed.",
    };

  } catch (error) {

    console.error("Notification Service Error:", error);

    return {
      success: false,
      message: "Notification service failed.",
    };

  }
};

module.exports = {
  sendNotification,
};