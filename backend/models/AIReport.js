const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"],
    },

    symptoms: {
      type: String,
      required: [true, "Symptoms are required"],
      trim: true,
      maxlength: [2000, "Symptoms cannot exceed 2000 characters"],
    },

    possibleDisease: {
      type: String,
      default: "Unknown",
      trim: true,
      maxlength: 200,
    },

    confidence: {
      type: String,
      default: "N/A",
      trim: true,
      maxlength: 50,
    },

    severity: {
      type: String,
      default: "Unknown",
      trim: true,
      maxlength: 100,
    },

    recommendedDoctor: {
      type: String,
      default: "General Physician",
      trim: true,
      maxlength: 150,
    },

    medicines: [
      {
        type: String,
        trim: true,
      },
    ],

    homeRemedies: [
      {
        type: String,
        trim: true,
      },
    ],

    diet: [
      {
        type: String,
        trim: true,
      },
    ],

    testsRecommended: [
      {
        type: String,
        trim: true,
      },
    ],

    precautions: [
      {
        type: String,
        trim: true,
      },
    ],

    emergency: {
      type: Boolean,
      default: false,
    },

    emergencyMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    disclaimer: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("AIReport", aiReportSchema);