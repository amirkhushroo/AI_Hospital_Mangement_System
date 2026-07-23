const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

// Controllers
const {
  // Registration
  registerPatient,
  verifyRegistrationOTP,
  resendRegistrationOTP,

  // Login
  loginPatient,
  loginWithOTP,
  verifyLoginOTP,

  // Forgot Password
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,

  // Profile
  getPatientProfile,
  updatePatientProfile,

  // Operator / Admin
  getAllPatients,
} = require("../controllers/patientController");

// ==========================================================
// Registration Routes
// ==========================================================

// Register Patient
router.post("/register", registerPatient);

// Verify Registration OTP
router.post("/verify-registration-otp", verifyRegistrationOTP);

// Resend Registration OTP
router.post("/resend-registration-otp", resendRegistrationOTP);

// ==========================================================
// Login Routes
// ==========================================================

// Login using Email/Mobile + Password
router.post("/login", loginPatient);

// Send Login OTP
router.post("/login-otp", loginWithOTP);

// Verify Login OTP
router.post("/verify-login-otp", verifyLoginOTP);

// ==========================================================
// Forgot Password Routes
// ==========================================================

// Send Forgot Password OTP
router.post("/forgot-password", forgotPassword);

// Verify Forgot Password OTP
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);

// Reset Password
router.post("/reset-password", resetPassword);

// ==========================================================
// Profile Routes
// ==========================================================

// Get Patient Profile
router.get("/profile", authMiddleware, getPatientProfile);

// Update Patient Profile
router.put("/profile", authMiddleware, updatePatientProfile);

// ==========================================================
// Operator/Admin Routes
// ==========================================================

// Get All Patients
router.get("/all", authMiddleware, getAllPatients);

module.exports = router;