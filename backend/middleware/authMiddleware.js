const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ====================== Check JWT Secret ======================

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");

      return res.status(500).json({
        success: false,
        message: "Server Configuration Error",
      });
    }

    // ====================== Get Authorization Header ======================

    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided.",
      });
    }

    // ====================== Validate Bearer Token ======================

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization Format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    // ====================== Verify Token ======================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token Expired. Please Login Again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
    });

  }
};

module.exports = authMiddleware;