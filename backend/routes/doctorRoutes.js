const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
} = require("../controllers/doctorController");

// ================= PUBLIC =================

router.post("/register", registerDoctor);

router.post("/login", loginDoctor);

// Public doctor list
router.get("/", getAllDoctors);

// Optional (same API)
router.get("/all", getAllDoctors);

// ================= PROTECTED =================

router.get("/profile", authMiddleware, getDoctorProfile);

router.put("/profile", authMiddleware, updateDoctorProfile);

module.exports = router;