const Notification = require("../models/Notification");
const sendEmail = require("./emailService");
const twilio = require("twilio");

// ====================== Twilio Client ======================

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
      try {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${recipient}`,
        });

        console.log("SMS sent successfully.");

        response = {
          success: true,
        };
      } catch (err) {
        console.error("Twilio SMS Error:", err);

        response = {
          success: false,
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