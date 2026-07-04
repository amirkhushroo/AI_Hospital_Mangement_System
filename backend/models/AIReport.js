const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    symptoms: {
      type: String,
      required: true,
    },

    possibleDisease: {
      type: String,
      default: "Unknown",
    },

    confidence: {
      type: String,
      default: "N/A",
    },

    severity: {
      type: String,
      default: "Unknown",
    },

    recommendedDoctor: {
      type: String,
      default: "General Physician",
    },

    medicines: [
      {
        type: String,
      },
    ],

    homeRemedies: [
      {
        type: String,
      },
    ],

    diet: [
      {
        type: String,
      },
    ],

    testsRecommended: [
      {
        type: String,
      },
    ],

    precautions: [
      {
        type: String,
      },
    ],

    emergency: {
      type: Boolean,
      default: false,
    },

    emergencyMessage: {
      type: String,
      default: "",
    },

    disclaimer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIReport", aiReportSchema);