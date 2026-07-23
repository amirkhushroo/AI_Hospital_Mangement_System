const Operator = require("../models/Operator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================== Register Operator ======================

const registerOperator = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if operator already exists
    const existingOperator = await Operator.findOne({ email });

    if (existingOperator) {
      return res.status(400).json({
        success: false,
        message: "Operator already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create operator
    const operator = await Operator.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Operator registered successfully",
      operator,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================== Login Operator ======================

const loginOperator = async (req, res) => {
  try {

    const { email, password } = req.body;

    const operator = await Operator.findOne({ email });

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      operator.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: operator._id,
        role: operator.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      operator,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================== Get Operator Profile ======================

const getOperatorProfile = async (req, res) => {
  try {

    const operator = await Operator.findById(req.user.id)
      .select("-password");

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });
    }

    res.status(200).json({
      success: true,
      operator,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================== Update Operator Profile ======================

const updateOperatorProfile = async (req, res) => {
  try {

    const { name, phone } = req.body;

    const operator = await Operator.findById(req.user.id);

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });
    }

    if (name !== undefined) {
      operator.name = name.trim();
    }

    if (phone !== undefined) {
      operator.phone = phone;
    }

    await operator.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      operator: {
        id: operator._id,
        name: operator.name,
        email: operator.email,
        phone: operator.phone,
        role: operator.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================== Exports ======================

module.exports = {
  registerOperator,
  loginOperator,
  getOperatorProfile,
  updateOperatorProfile,
};