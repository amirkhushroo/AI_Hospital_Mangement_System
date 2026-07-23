const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },

    userModel: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor", "Admin"],
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "OTP",
        "APPOINTMENT_BOOKED",
        "APPOINTMENT_ACCEPTED",
        "APPOINTMENT_REJECTED",
        "APPOINTMENT_CANCELLED",
        "APPOINTMENT_RESCHEDULED",
        "APPOINTMENT_REMINDER",
        "REPORT_UPLOADED",
        "AI_REPORT",
        "FORGOT_PASSWORD",
        "GENERAL",
      ],
    },

    channel: {
      type: String,
      required: true,
      enum: ["email", "sms"],
    },

    recipient: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);