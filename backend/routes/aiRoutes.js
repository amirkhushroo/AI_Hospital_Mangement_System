const express = require("express");
const router = express.Router();

// ====================== Middleware ======================

const authMiddleware = require("../middleware/authMiddleware");

// ====================== Controllers ======================

const {
  symptomChecker,
  getAIReportHistory,
  getSingleAIReport,
} = require("../controllers/aiController");

// ====================== AI Routes ======================

// AI Symptom Checker
router.post("/symptom-checker", authMiddleware, symptomChecker);

// Get AI Report History
router.get("/history", authMiddleware, getAIReportHistory);

// Get Single AI Report
router.get("/report/:id", authMiddleware, getSingleAIReport);

module.exports = router;