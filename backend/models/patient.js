const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    age: {
      type: Number,
      default: null,
      min: [0, "Age cannot be negative"],
      max: [120, "Please enter a valid age"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      match: [
        /^$|^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number",
      ],
    },

    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: [250, "Address cannot exceed 250 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Patient", patientSchema);