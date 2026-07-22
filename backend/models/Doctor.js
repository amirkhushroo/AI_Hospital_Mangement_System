const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
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

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      maxlength: [100, "Specialization cannot exceed 100 characters"],
    },

    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      trim: true,
      maxlength: [100, "Qualification cannot exceed 100 characters"],
    },

    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
      max: [60, "Please enter a valid experience"],
    },

    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Consultation fee cannot be negative"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number",
      ],
    },

    hospital: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      maxlength: [150, "Hospital name cannot exceed 150 characters"],
    },

    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],

    availableTime: {
      start: {
        type: String,
        default: "",
      },

      end: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);