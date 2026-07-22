const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor is required"],
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },

    appointmentTime: {
      type: String,
      required: [true, "Appointment time is required"],
      trim: true,
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Please enter a valid time in HH:MM format",
      ],
    },

    // ====================== Patient Symptoms ======================

    symptoms: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Symptoms cannot exceed 500 characters"],
    },

    // ====================== Appointment Status ======================

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ====================== Doctor Notes ======================

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    // ====================== Payment Status ======================

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ====================== Indexes ======================

// Faster searching by doctor and appointment date
appointmentSchema.index({
  doctor: 1,
  appointmentDate: 1,
});

// Faster searching by patient
appointmentSchema.index({
  patient: 1,
});

// Prevent duplicate appointments for the same doctor at the same date & time
appointmentSchema.index(
  {
    doctor: 1,
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);