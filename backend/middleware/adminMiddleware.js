const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided.",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found.",
      });
    }

    req.admin = admin;

    next();

  } catch (error) {

    console.error("Admin Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Admin Token",
    });

  }
};

module.exports = adminMiddleware;