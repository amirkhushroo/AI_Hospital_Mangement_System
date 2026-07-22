const Patient = require("../models/patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ====================== REGISTER PATIENT ======================

const registerPatient = async (req, res) => {
  try {
    let { name, email, password, age, gender, phone, address } = req.body;

    // ====================== Validate Required Fields ======================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret is not configured",
      });
    }

    // ====================== Normalize Input ======================

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // ====================== Check Existing Patient ======================

    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Patient already exists",
      });
    }

    // ====================== Hash Password ======================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ====================== Create Patient ======================

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
      address,
    });

    // ====================== Generate Token ======================

    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Patient Registered Successfully",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== LOGIN PATIENT ======================

const loginPatient = async (req, res) => {
  try {

    let { email, password } = req.body;

    // ====================== Validate Required Fields ======================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret is not configured",
      });
    }

    // ====================== Normalize Input ======================

    email = email.trim().toLowerCase();
    password = password.trim();

    // ====================== Find Patient ======================

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // ====================== Compare Password ======================

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // ====================== Generate Token ======================

    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET PATIENT PROFILE ======================

const getPatientProfile = async (req, res) => {
  try {

    const patient = await Patient.findById(req.user.id).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== UPDATE PATIENT PROFILE ======================

const updatePatientProfile = async (req, res) => {
  try {

    const { name, age, gender, phone, address } = req.body;

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (name !== undefined) patient.name = name.trim();
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (phone !== undefined) patient.phone = phone.trim();
    if (address !== undefined) patient.address = address.trim();

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== EXPORT ======================

module.exports = {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
};