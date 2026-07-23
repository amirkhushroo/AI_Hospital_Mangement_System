const express = require("express");
const router = express.Router();

const {
  uploadReport,
  getAllReports,
  getPatientReports,
  deleteReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

// We will configure multer in the next step
const upload = require("../middleware/upload");

// Upload Report
router.post(
  "/upload",
  authMiddleware,
  upload.single("report"),
  uploadReport
);

// Get all reports
router.get("/", authMiddleware, getAllReports);

// Get reports of a patient
router.get("/patient/:patientId", authMiddleware, getPatientReports);

// Delete report
router.delete("/:id", authMiddleware, deleteReport);

module.exports = router;