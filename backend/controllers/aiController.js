const mongoose = require("mongoose");
const { analyzeSymptoms } = require("../services/geminiService");
const AIReport = require("../models/AIReport");
const Doctor = require("../models/Doctor");

// ====================== DOCTOR SPECIALIZATION MAPPING ======================

const mapDoctorSpecialization = (specialization) => {
  const doctorMap = {
    "General Practitioner": "General Physician",
    "General Practitioner (GP)": "General Physician",
    "General Physician": "General Physician",

    "Heart Specialist": "Cardiologist",
    Cardiology: "Cardiologist",
    Cardiologist: "Cardiologist",

    "Brain Specialist": "Neurologist",
    Neurology: "Neurologist",
    Neurologist: "Neurologist",

    "Bone Specialist": "Orthopedic",
    Orthopedics: "Orthopedic",
    Orthopedic: "Orthopedic",

    "Skin Specialist": "Dermatologist",
    Dermatology: "Dermatologist",
    Dermatologist: "Dermatologist",

    "Eye Specialist": "Ophthalmologist",
    Ophthalmologist: "Ophthalmologist",

    "ENT Specialist": "ENT Specialist",

    "Child Specialist": "Pediatrician",
    Pediatrician: "Pediatrician",

    Gynecologist: "Gynecologist",

    Psychiatrist: "Psychiatrist",

    Pulmonologist: "Pulmonologist",

    Gastroenterologist: "Gastroenterologist",

    Nephrologist: "Nephrologist",

    Endocrinologist: "Endocrinologist",

    Oncologist: "Oncologist",

    Urologist: "Urologist",
  };

  return doctorMap[specialization] || specialization;
};

// ====================== AI SYMPTOM CHECKER ======================

const symptomChecker = async (req, res) => {
  try {
    const symptoms = req.body.symptoms?.trim();

    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: "Please provide symptoms.",
      });
    }

    // Analyze Symptoms
    const result = await analyzeSymptoms(symptoms);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "No response received from AI service.",
      });
    }

    let aiResult;

    try {
      aiResult = JSON.parse(result);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response.",
        rawResponse: result,
      });
    }

    // Default Values
    aiResult = {
      possibleDisease: aiResult.possibleDisease || "Unknown",
      confidence: aiResult.confidence || "N/A",
      severity: aiResult.severity || "Unknown",
      recommendedDoctor:
        aiResult.recommendedDoctor || "General Physician",
      medicines: Array.isArray(aiResult.medicines)
        ? aiResult.medicines
        : [],
      homeRemedies: Array.isArray(aiResult.homeRemedies)
        ? aiResult.homeRemedies
        : [],
      diet: Array.isArray(aiResult.diet) ? aiResult.diet : [],
      testsRecommended: Array.isArray(aiResult.testsRecommended)
        ? aiResult.testsRecommended
        : [],
      precautions: Array.isArray(aiResult.precautions)
        ? aiResult.precautions
        : [],
      emergency: aiResult.emergency || false,
      emergencyMessage: aiResult.emergencyMessage || "",
      disclaimer:
        aiResult.disclaimer ||
        "This AI analysis is for informational purposes only. Please consult a qualified doctor.",
    };

    // ====================== EMERGENCY ENHANCEMENT ======================

    if (
      aiResult.severity?.toLowerCase() === "critical" ||
      aiResult.emergency === true
    ) {
      aiResult.emergency = true;

      aiResult.emergencyMessage =
        "🚨 Please visit the nearest hospital immediately or call emergency services.";
    }

    // ====================== SAVE AI REPORT ======================

    const report = await AIReport.create({
      patient: req.user.id,
      symptoms,
      possibleDisease: aiResult.possibleDisease,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      recommendedDoctor: aiResult.recommendedDoctor,
      medicines: aiResult.medicines,
      homeRemedies: aiResult.homeRemedies,
      diet: aiResult.diet,
      testsRecommended: aiResult.testsRecommended,
      precautions: aiResult.precautions,
      emergency: aiResult.emergency,
      emergencyMessage: aiResult.emergencyMessage,
      disclaimer: aiResult.disclaimer,
    });

    // ====================== FIND MATCHING DOCTORS ======================

    const mappedDoctor = mapDoctorSpecialization(
      aiResult.recommendedDoctor
    );

    const doctors = await Doctor.find({
      specialization: {
        $regex: mappedDoctor,
        $options: "i",
      },
    })
      .select(
        "name specialization qualification consultationFee hospital phone availableDays availableTime"
      )
      .lean();

    // ====================== RESPONSE ======================

    res.status(200).json({
      success: true,
      message: "Symptoms analyzed successfully",
      reportId: report._id,
      result: aiResult,
      recommendedSpecialization: mappedDoctor,
      availableDoctors: doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ====================== GET AI REPORT HISTORY ======================

const getAIReportHistory = async (req, res) => {
  try {
    const reports = await AIReport.find({
      patient: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ====================== GET SINGLE AI REPORT ======================

const getSingleAIReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID.",
      });
    }

    const report = await AIReport.findOne({
      _id: id,
      patient: req.user.id,
    }).lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "AI Report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ====================== EXPORT ======================

module.exports = {
  symptomChecker,
  getAIReportHistory,
  getSingleAIReport,
};