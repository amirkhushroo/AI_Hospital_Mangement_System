const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    // Get Token
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided.",
      });
    }

    // Remove Bearer
    const jwtToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    // Verify Token
    const decoded = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.log("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });

  }
};

module.exports = authMiddleware;