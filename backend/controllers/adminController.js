const Admin = require("../models/Admin");
const Patient = require("../models/patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const AIReport = require("../models/AIReport");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  sendOTP,
  verifyOTP,
} = require("../services/otpService");

const {
  sendNotification,
} = require("../services/notificationService");

const isEmail = require("../utils/isEmail");

// ====================== CREATE ADMIN ======================

const createAdmin = async (req, res) => {
  try {

    let {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required.",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Address.",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const admin = await Admin.create({
  name,
  email,
  password,
});

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {

    console.error("Create Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== ADMIN LOGIN ======================

const adminLogin = async (req, res) => {
  try {
    console.log("Step 1: Login request received");

    let { identifier, password } = req.body;
    console.log("Request Body:", req.body);

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    identifier = identifier.trim().toLowerCase();
    password = password.trim();

    console.log("Step 2: Searching admin...");

    const admin = await Admin.findOne({
      email: identifier,
    }).select("+password");

    console.log("Admin Found:", admin);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    console.log("Stored Password:", admin.password);

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password.",
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    console.log("Step 3: Password verified");

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("Step 4: Token generated");

    return res.status(200).json({
      success: true,
      message: "Admin Login Successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("============== LOGIN ERROR ==============");
    console.error(error);
    console.error(error.stack);
    console.error("=========================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ====================== FORGOT PASSWORD ======================

const forgotPassword = async (req, res) => {
  try {

    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    email = email.trim().toLowerCase();

    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Address.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    await sendOTP({
      identifier: email,
      role: "admin",
      purpose: "FORGOT_PASSWORD",
      channel: "email",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully.",
    });

  } catch (error) {

    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== VERIFY FORGOT PASSWORD OTP ======================

const verifyForgotPasswordOTP = async (req, res) => {
  try {

    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    email = email.trim().toLowerCase();

    const result = await verifyOTP({
      identifier: email,
      otp,
      purpose: "FORGOT_PASSWORD",
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    console.error("Verify Forgot Password OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== RESET PASSWORD ======================

const resetPassword = async (req, res) => {
  try {

    let {
      email,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, New Password and Confirm Password are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    email = email.trim().toLowerCase();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    admin.password = newPassword;

await admin.save();

    await sendNotification({
      userId: admin._id,
      userModel: "Admin",
      recipient: admin.email,
      channel: "email",
      title: "Password Changed Successfully",
      message: "Your password has been changed successfully.",
      type: "FORGOT_PASSWORD",
      html: `
        <h2>Password Updated</h2>
        <p>Your password has been changed successfully.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {

    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== ADMIN PROFILE ======================

const getAdminProfile = async (req, res) => {
  try {

    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });

  } catch (error) {

    console.error("Get Admin Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== ADMIN DASHBOARD ======================

const getDashboard = async (req, res) => {
  try {

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalAIReports,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      AIReport.countDocuments(),
      Appointment.countDocuments({ status: "Pending" }),
      Appointment.countDocuments({ status: "Confirmed" }),
      Appointment.countDocuments({ status: "Completed" }),
      Appointment.countDocuments({ status: "Cancelled" }),
    ]);

    const recentAppointments = await Appointment.find()
      .populate("patient", "name")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalAIReports,
        appointments: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        recentAppointments,
      },
    });

  } catch (error) {

    console.error("Get Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL DOCTORS ======================

const getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find().select("-password");

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    console.error("Get All Doctors Error:", error);

    return res.status(500).json({
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
        message: "Doctor not found.",
      });
    }

    const {
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      phone,
      address,
      availableDays,
      availableTime,
      status,
    } = req.body;

    if (name !== undefined) doctor.name = name;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (qualification !== undefined) doctor.qualification = qualification;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (phone !== undefined) doctor.phone = phone;
    if (address !== undefined) doctor.address = address;
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (availableTime !== undefined) doctor.availableTime = availableTime;
    if (status !== undefined) doctor.status = status;

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      doctor,
    });

  } catch (error) {

    console.error("Update Doctor Error:", error);

    return res.status(500).json({
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
        message: "Doctor not found.",
      });
    }

    await Doctor.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully.",
    });

  } catch (error) {

    console.error("Delete Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
// ====================== GET ALL PATIENTS ======================

const getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find().select("-password");

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {

    console.error("Get All Patients Error:", error);

    return res.status(500).json({
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
        message: "Patient not found.",
      });
    }

    await Appointment.deleteMany({
      patient: patient._id,
    });

    await AIReport.deleteMany({
      patient: patient._id,
    });

    await Patient.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Patient and related records deleted successfully.",
    });

  } catch (error) {

    console.error("Delete Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL APPOINTMENTS ======================

const getAllAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {

    console.error("Get All Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== GET ALL AI REPORTS ======================

const getAllAIReports = async (req, res) => {
  try {

    const reports = await AIReport.find()
  .populate("patient", "name email phone")
  .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });

  } catch (error) {

    console.error("Get All AI Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== EXPORTS ======================

module.exports = {

  // Authentication
  createAdmin,
  adminLogin,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,

  // Profile
  getAdminProfile,

  // Dashboard
  getDashboard,

  // Doctor Management
  getAllDoctors,
  updateDoctor,
  deleteDoctor,

  // Patient Management
  getAllPatients,
  deletePatient,

  // Appointment Management
  getAllAppointments,

  // AI Report Management
  getAllAIReports,

};

