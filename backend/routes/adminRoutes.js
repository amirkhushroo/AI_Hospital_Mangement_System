const express = require("express");
const router = express.Router();

// ====================== Middleware ======================

const adminMiddleware = require("../middleware/adminMiddleware");

// ====================== Controllers ======================

const {
  createAdmin,
  adminLogin,
  getAdminProfile,
  getDashboard,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
  deletePatient,
  getAllAppointments,
  getAllAIReports,
} = require("../controllers/adminController");

// ====================== Public Routes ======================

// Create Admin
router.post("/create", createAdmin);

// Admin Login
router.post("/login", adminLogin);

// ====================== Protected Routes ======================

// Admin Profile
router.get("/profile", adminMiddleware, getAdminProfile);

// Admin Dashboard
router.get("/dashboard", adminMiddleware, getDashboard);

// ====================== Doctor Management ======================

// Get All Doctors
router.get("/doctors", adminMiddleware, getAllDoctors);

// Update Doctor
router.put("/doctor/:id", adminMiddleware, updateDoctor);

// Delete Doctor
router.delete("/doctor/:id", adminMiddleware, deleteDoctor);

// ====================== Patient Management ======================

// Get All Patients
router.get("/patients", adminMiddleware, getAllPatients);

// Delete Patient
router.delete("/patient/:id", adminMiddleware, deletePatient);

// ====================== Appointment Management ======================

// Get All Appointments
router.get("/appointments", adminMiddleware, getAllAppointments);

// ====================== AI Reports Management ======================

// Get All AI Reports
router.get("/ai-reports", adminMiddleware, getAllAIReports);

module.exports = router;