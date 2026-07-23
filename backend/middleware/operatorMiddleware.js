const operatorMiddleware = (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Check operator role
    if (req.user.role !== "operator") {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Operator Only.",
      });
    }

    next();
  } catch (error) {
    console.log("Operator Middleware Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = operatorMiddleware;