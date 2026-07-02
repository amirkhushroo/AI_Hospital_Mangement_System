const express = require("express");
const router = express.Router();

// ====================== Middleware ======================

const authMiddleware = require("../middleware/authMiddleware");

// ====================== Controllers ======================

const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");

// =======================================================
//                 APPOINTMENT ROUTES
// =======================================================

// ====================== Patient Routes ======================

// Book Appointment
router.post("/book", authMiddleware, bookAppointment);

// Get Logged-in Patient Appointments
router.get("/patient", authMiddleware, getPatientAppointments);

// Cancel Appointment
router.put("/cancel/:id", authMiddleware, cancelAppointment);

// ====================== Doctor Routes ======================

// Get Logged-in Doctor Appointments
router.get("/doctor", authMiddleware, getDoctorAppointments);

// Update Appointment Status
router.put("/status/:id", authMiddleware, updateAppointmentStatus);

module.exports = router;