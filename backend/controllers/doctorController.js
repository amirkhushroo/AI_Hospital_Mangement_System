const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ====================== REGISTER DOCTOR ======================

const registerDoctor = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      specialization,
      qualification,
      experience,
      consultationFee,
      phone,
      hospital,
      availableDays,
      availableTime,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required",
      });
    }

    // Normalize Input
    name = name.trim();
    email = email.trim().toLowerCase();
    specialization = specialization?.trim();
    qualification = qualification?.trim();
    phone = phone?.trim();
    hospital = hospital?.trim();

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      qualification,
      experience,
      consultationFee,
      phone,
      hospital,
      availableDays,
      availableTime,
    });

    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const doctorData = await Doctor.findById(doctor._id).select("-password");

    res.status(201).json({
      success: true,
      message: "Doctor Registered Successfully",
      token,
      doctor: doctorData,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== LOGIN DOCTOR ======================

const loginDoctor = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    email = email.trim().toLowerCase();

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const doctorData = await Doctor.findById(doctor._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor Login Successful",
      token,
      doctor: doctorData,
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

// ====================== GET DOCTOR PROFILE ======================

const getDoctorProfile = async (req, res) => {
  try {

    const doctor = await Doctor.findById(req.user.id).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
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

// ====================== UPDATE DOCTOR PROFILE ======================

const updateDoctorProfile = async (req, res) => {
  try {

    const {
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      phone,
      hospital,
      availableDays,
      availableTime,
    } = req.body;

    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (name !== undefined) doctor.name = name.trim();
    if (specialization !== undefined) doctor.specialization = specialization.trim();
    if (qualification !== undefined) doctor.qualification = qualification.trim();
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (phone !== undefined) doctor.phone = phone.trim();
    if (hospital !== undefined) doctor.hospital = hospital.trim();
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (availableTime !== undefined) doctor.availableTime = availableTime;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor Profile Updated Successfully",
      doctor: updatedDoctor,
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
  registerDoctor,
  loginDoctor,
  getAllDoctors,
  getDoctorProfile,
  updateDoctorProfile,
};