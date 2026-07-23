const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email (Optional)
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      default: null,
    },

    // Phone (Optional)
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    preferredNotification: {
      type: String,
      enum: ["email", "sms", "both"],
      default: "email",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);