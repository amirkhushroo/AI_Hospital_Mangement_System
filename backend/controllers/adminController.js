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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== ADMIN LOGIN ======================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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

    Object.assign(doctor, req.body);

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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