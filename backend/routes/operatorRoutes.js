const express = require("express");
const router = express.Router();

// ====================== Controllers ======================

const {
  registerOperator,
  loginOperator,
  getOperatorProfile,
  updateOperatorProfile,
} = require("../controllers/operatorController");

// ====================== Middleware ======================

const authMiddleware = require("../middleware/authMiddleware");

// ========================================================
//                    PUBLIC ROUTES
// ========================================================

// Register Operator
router.post("/register", registerOperator);

// Login Operator
router.post("/login", loginOperator);

// ========================================================
//                   PROTECTED ROUTES
// ========================================================

// Get Operator Profile
router.get("/profile", authMiddleware, getOperatorProfile);

// Update Operator Profile
router.put("/profile", authMiddleware, updateOperatorProfile);

module.exports = router;