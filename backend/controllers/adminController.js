const Admin = require("../models/Admin");
const Patient = require("../models/patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const AIReport = require("../models/AIReport");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================== CREATE ADMIN ======================

const createAdmin = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
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

// ====================== ADMIN LOGIN ======================

const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

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

    email = email.trim().toLowerCase();

    // Fetch admin with password
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.password) {
      return res.status(500).json({
        success: false,
        message: "Admin password is missing from database.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ====================== ADMIN PROFILE ======================

const getAdminProfile = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      admin: req.admin,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== ADMIN DASHBOARD ======================

const getDashboard = async (req, res) => {
  try {

    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalAIReports = await AIReport.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalAIReports,
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

// ====================== GET ALL DOCTORS ======================

const getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find().select("-password");

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== UPDATE DOCTOR ======================

const updateDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "specialization",
      "qualification",
      "experience",
      "consultationFee",
      "phone",
      "hospital",
      "availableDays",
      "availableTime",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();

    const updatedDoctor = await Doctor.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor: updatedDoctor,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== DELETE DOCTOR ======================

const deleteDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL PATIENTS ======================

const getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find().select("-password");

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== DELETE PATIENT ======================

const deletePatient = async (req, res) => {
  try {

    const { id } = req.params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await Patient.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL APPOINTMENTS ======================

const getAllAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL AI REPORTS ======================

const getAllAIReports = async (req, res) => {
  try {

    const reports = await AIReport.find()
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
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
  createAdmin,
  adminLogin,
  getAdminProfile,
  getDashboard,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
  deletePatient,
  getAllAppointments,
  getAllAIReports,
};