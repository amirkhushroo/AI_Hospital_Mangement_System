const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "REGISTER",
        "LOGIN",
        "FORGOT_PASSWORD",
      ],
      required: true,
    },

    role: {
      type: String,
      enum: [
        "patient",
        "doctor",
        "admin",
      ],
      required: true,
    },

    channel: {
      type: String,
      enum: [
        "email",
        "sms",
      ],
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);