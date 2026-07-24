const Patient = require("../models/patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  sendOTP,
  verifyOTP,
} = require("../services/otpService");

const {
  sendNotification,
} = require("../services/notificationService");

const isEmail = require("../utils/isEmail");
const isPhone = require("../utils/isPhone");

// ====================== REGISTER PATIENT ======================

const registerPatient = async (req, res) => {
  try {
    let {
      name,
      identifier,
      password,
      age,
      gender,
      address,
    } = req.body;

    let email = null;
    let phone = null;

    // ====================== Validate Required Fields ======================

    if (!name || !identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email/Mobile Number and Password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret is not configured.",
      });
    }

    // ====================== Normalize Data ======================

    name = name.trim();
    identifier = identifier.trim();
    password = password.trim();

    // ====================== Detect Email or Phone ======================

    if (isEmail(identifier)) {
      email = identifier.toLowerCase();
    } else if (isPhone(identifier)) {
      phone = identifier;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Email or Mobile Number.",
      });
    }

    // ====================== Validate Email ======================

    if (email && !isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Address.",
      });
    }

    // ====================== Validate Mobile ======================

    if (phone && !isPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mobile Number.",
      });
    }

    // ====================== Check Existing Email ======================

    if (email) {
      const existingEmail = await Patient.findOne({ email });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered.",
        });
      }
    }

    // ====================== Check Existing Mobile ======================

    if (phone) {
      const existingPhone = await Patient.findOne({ phone });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Mobile Number already registered.",
        });
      }
    }

    // ====================== Hash Password ======================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ====================== Notification Preference ======================

    const preferredNotification = email ? "email" : "sms";

    // ====================== Create Patient ======================

    const patientData = {
      name,
      password: hashedPassword,
      age,
      gender,
      address,
      preferredNotification,
      isEmailVerified: false,
      isPhoneVerified: false,
    };

    if (email) {
      patientData.email = email;
      patientData.isEmailVerified = true;
    }

    if (phone) {
      patientData.phone = phone;
      patientData.isPhoneVerified = false;
    }

    const patient = await Patient.create(patientData);

    // ====================== Registration OTP ======================

    if (phone) {
      await sendOTP({
        identifier: phone,
        role: "patient",
        purpose: "REGISTER",
        channel: "sms",
      });
    }

    // ====================== Welcome Notification ======================

    if (email) {
      await sendNotification({
        userId: patient._id,
        userModel: "Patient",
        recipient: email,
        channel: "email",
        title: "Welcome to AI Hospital Management System",
        message: "Your account has been created successfully.",
        type: "GENERAL",
        html: `
          <h2>Welcome ${patient.name}</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now login using your email and password.</p>
        `,
      });
    }

    if (phone) {
      await sendNotification({
        userId: patient._id,
        userModel: "Patient",
        recipient: phone,
        channel: "sms",
        title: "Welcome",
        message:
          "Welcome to AI Hospital Management System. Please verify the OTP sent to your mobile.",
        type: "GENERAL",
      });
    }

    // ====================== Generate Token ======================

    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ====================== Response ======================

    return res.status(201).json({
      success: true,
      message: phone
        ? "Registration successful. Please verify the OTP sent to your mobile."
        : "Registration successful. You can now login using your email and password.",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
        address: patient.address,
        preferredNotification: patient.preferredNotification,
        isEmailVerified: patient.isEmailVerified,
        isPhoneVerified: patient.isPhoneVerified,
      },
    });

  } catch (error) {
    console.error("Register Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ====================== VERIFY REGISTRATION OTP ======================

const verifyRegistrationOTP = async (req, res) => {
  try {
    let { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile Number and OTP are required.",
      });
    }

    phone = phone.trim();

    if (!isPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mobile Number.",
      });
    }

    const result = await verifyOTP({
      identifier: phone,
      otp,
      purpose: "REGISTER",
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const patient = await Patient.findOne({ phone });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    patient.isPhoneVerified = true;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Mobile Number verified successfully.",
    });

  } catch (error) {

    console.error("Verify Registration OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== RESEND REGISTRATION OTP ======================

const resendRegistrationOTP = async (req, res) => {
  try {

    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Mobile Number is required.",
      });
    }

    phone = phone.trim();

    if (!isPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Mobile Number.",
      });
    }

    const patient = await Patient.findOne({ phone });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    await sendOTP({
      identifier: phone,
      role: "patient",
      purpose: "REGISTER",
      channel: "sms",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== LOGIN PATIENT ======================

const loginPatient = async (req, res) => {
  try {
    let { identifier, password } = req.body;

    // ====================== Validate Required Fields ======================

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and Password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret is not configured.",
      });
    }

    identifier = identifier.trim();
    password = password.trim();

    let patient;

    // ====================== Email Login ======================

    if (isEmail(identifier)) {

      patient = await Patient.findOne({
        email: identifier.toLowerCase(),
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

    }

    // ====================== Phone Login ======================

    else if (isPhone(identifier)) {

      patient = await Patient.findOne({
        phone: identifier,
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      if (!patient.isPhoneVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your Mobile Number before logging in.",
        });
      }

    }

    // ====================== Invalid Identifier ======================

    else {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Mobile Number.",
      });

    }

    // ====================== Compare Password ======================

    const isMatch = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password.",
      });
    }

    // ====================== Update Last Login ======================

    patient.lastLogin = new Date();

    await patient.save();

    // ====================== Login Notification ======================

    if (
      patient.preferredNotification === "email" ||
      patient.preferredNotification === "both"
    ) {

      if (patient.email) {

        await sendNotification({
          userId: patient._id,
          userModel: "Patient",
          recipient: patient.email,
          channel: "email",
          title: "Login Successful",
          message: "You have successfully logged into your account.",
          type: "GENERAL",
          html: `
            <h2>Login Successful</h2>
            <p>Hello ${patient.name},</p>
            <p>Your account was logged in successfully.</p>
          `,
        });

      }

    }

    if (
      patient.preferredNotification === "sms" ||
      patient.preferredNotification === "both"
    ) {

      if (patient.phone) {

        await sendNotification({
          userId: patient._id,
          userModel: "Patient",
          recipient: patient.phone,
          channel: "sms",
          title: "Login Successful",
          message: "You have successfully logged into your account.",
          type: "GENERAL",
        });

      }

    }

    // ====================== Generate JWT ======================

    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ====================== Response ======================

    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
        address: patient.address,
        preferredNotification: patient.preferredNotification,
        isEmailVerified: patient.isEmailVerified,
        isPhoneVerified: patient.isPhoneVerified,
        lastLogin: patient.lastLogin,
      },
    });

  } catch (error) {

    console.error("Login Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== FORGOT PASSWORD ======================

const forgotPassword = async (req, res) => {
  try {

    let { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile Number is required.",
      });
    }

    identifier = identifier.trim();

    let patient;
    let channel;

    // ====================== Email ======================

    if (isEmail(identifier)) {

      patient = await Patient.findOne({
        email: identifier.toLowerCase(),
      });

      channel = "email";

    }

    // ====================== Mobile ======================

    else if (isPhone(identifier)) {

      patient = await Patient.findOne({
        phone: identifier,
      });

      channel = "sms";

    }

    // ====================== Invalid Identifier ======================

    else {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Mobile Number.",
      });

    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    await sendOTP({
      identifier,
      role: "patient",
      purpose: "FORGOT_PASSWORD",
      channel,
    });

    return res.status(200).json({
      success: true,
      message:
        channel === "email"
          ? "Password reset OTP has been sent to your email."
          : "Password reset OTP has been sent to your mobile.",
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

    let { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier and OTP are required.",
      });
    }

    identifier = identifier.trim();

    const result = await verifyOTP({
      identifier,
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
      identifier,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!identifier || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Identifier, New Password and Confirm Password are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    identifier = identifier.trim();

    let patient;

    // ====================== Email ======================

    if (isEmail(identifier)) {

      patient = await Patient.findOne({
        email: identifier.toLowerCase(),
      });

    }

    // ====================== Mobile ======================

    else if (isPhone(identifier)) {

      patient = await Patient.findOne({
        phone: identifier,
      });

    }

    // ====================== Invalid Identifier ======================

    else {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Mobile Number.",
      });

    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    patient.password = await bcrypt.hash(newPassword, 10);

    await patient.save();

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

// ====================== LOGIN WITH OTP ======================

const loginWithOTP = async (req, res) => {
  try {

    let { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile Number is required.",
      });
    }

    identifier = identifier.trim();

    let patient;
    let channel;

    // ====================== Email ======================

    if (isEmail(identifier)) {

      patient = await Patient.findOne({
        email: identifier.toLowerCase(),
      });

      channel = "email";

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

    }

    // ====================== Mobile ======================

    else if (isPhone(identifier)) {

      patient = await Patient.findOne({
        phone: identifier,
      });

      channel = "sms";

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found.",
        });
      }

      if (!patient.isPhoneVerified) {
        return res.status(403).json({
          success: false,
          message:
            "Please verify your Mobile Number before logging in.",
        });
      }

    }

    // ====================== Invalid Identifier ======================

    else {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Mobile Number.",
      });

    }

    await sendOTP({
      identifier,
      role: "patient",
      purpose: "LOGIN",
      channel,
    });

    return res.status(200).json({
      success: true,
      message:
        channel === "email"
          ? "OTP sent to your email."
          : "OTP sent to your mobile.",
    });

  } catch (error) {

    console.error("Login With OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== VERIFY LOGIN OTP ======================

const verifyLoginOTP = async (req, res) => {
  try {

    let { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier and OTP are required.",
      });
    }

    identifier = identifier.trim();

    const result = await verifyOTP({
      identifier,
      otp,
      purpose: "LOGIN",
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    let patient;

    // ====================== Email ======================

    if (isEmail(identifier)) {

      patient = await Patient.findOne({
        email: identifier.toLowerCase(),
      });

    }

    // ====================== Mobile ======================

    else if (isPhone(identifier)) {

      patient = await Patient.findOne({
        phone: identifier,
      });

    }

    // ====================== Invalid Identifier ======================

    else {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Mobile Number.",
      });

    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // ====================== Update Last Login ======================

    patient.lastLogin = new Date();

    await patient.save();

    // ====================== Generate JWT ======================

    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",   // ✅ Fixed
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ====================== Login Notification ======================

    if (patient.email) {

      await sendNotification({
        userId: patient._id,
        userModel: "Patient",
        recipient: patient.email,
        channel: "email",
        title: "OTP Login Successful",
        message: "You have successfully logged in using OTP.",
        type: "GENERAL",
        html: `
          <h2>Login Successful</h2>
          <p>Hello ${patient.name},</p>
          <p>Your account has been logged in successfully using OTP.</p>
        `,
      });

    }

    if (patient.phone) {

      await sendNotification({
        userId: patient._id,
        userModel: "Patient",
        recipient: patient.phone,
        channel: "sms",
        title: "OTP Login Successful",
        message: "You have successfully logged in using OTP.",
        type: "GENERAL",
      });

    }

    // ====================== Response ======================

    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        gender: patient.gender,
        address: patient.address,
        preferredNotification: patient.preferredNotification,
        isEmailVerified: patient.isEmailVerified,
        isPhoneVerified: patient.isPhoneVerified,
        lastLogin: patient.lastLogin,
      },
    });

  } catch (error) {

    console.error("Verify Login OTP Error:", error);

    return res.status(500).json({
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
        message: "Patient not found.",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {

    console.error("Get Patient Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// ====================== UPDATE PATIENT PROFILE ======================

const updatePatientProfile = async (req, res) => {
  try {

    const {
      name,
      age,
      gender,
      phone,
      address,
      preferredNotification,
    } = req.body;

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    if (name !== undefined) patient.name = name.trim();

    if (age !== undefined) patient.age = age;

    if (gender !== undefined) patient.gender = gender;

    if (phone !== undefined) {

      if (phone && !isPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Mobile Number.",
        });
      }

      const existingPatient = await Patient.findOne({
        phone,
        _id: { $ne: patient._id },
      });

      if (existingPatient) {
        return res.status(409).json({
          success: false,
          message: "Mobile Number already exists.",
        });
      }

      patient.phone = phone.trim();
    }

    if (address !== undefined)
      patient.address = address.trim();

    if (preferredNotification !== undefined) {

      if (!["email", "sms", "both"].includes(preferredNotification)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification preference.",
        });
      }

      patient.preferredNotification = preferredNotification;
    }

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully.",
      patient,
    });

  } catch (error) {

    console.error("Update Patient Profile Error:", error);

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

// ====================== EXPORTS ======================

module.exports = {
  registerPatient,
  verifyRegistrationOTP,
  resendRegistrationOTP,

  loginPatient,
  loginWithOTP,
  verifyLoginOTP,

  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,

  getPatientProfile,
  updatePatientProfile,
  getAllPatients,
};