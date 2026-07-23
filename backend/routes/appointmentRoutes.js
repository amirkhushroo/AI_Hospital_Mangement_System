const express = require("express");
const router = express.Router();

// ====================== Middleware ======================

const authMiddleware = require("../middleware/authMiddleware");
const operatorMiddleware = require("../middleware/operatorMiddleware");

// ====================== Controllers ======================

const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
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

// ====================== Operator Routes ======================

// Get All Appointments
router.get(
  "/all",
  authMiddleware,
  operatorMiddleware,
  getAllAppointments
);

// Reschedule Appointment
router.put(
  "/reschedule/:id",
  authMiddleware,
  operatorMiddleware,
  rescheduleAppointment
);

module.exports = router;