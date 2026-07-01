const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

// Controllers
const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
} = require("../controllers/patientController");

// ====================== Public Routes ======================

// Register Patient
router.post("/register", registerPatient);

// Login Patient
router.post("/login", loginPatient);

// ====================== Protected Routes ======================

// Get Patient Profile
router.get("/profile", authMiddleware, getPatientProfile);

// Update Patient Profile
router.put("/profile", authMiddleware, updatePatientProfile);

module.exports = router;