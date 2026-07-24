const Appointment = require("../models/Appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/Doctor");

// ====================== BOOK APPOINTMENT ======================

const bookAppointment = async (req, res) => {
  try {

    console.log("===== BOOK APPOINTMENT =====");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
    } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, Date and Time are required",
      });
    }

    let patient;

    // Patient books their own appointment
    if (req.user.role === "patient") {
      patient = await Patient.findById(req.user.id);
    }

    // Operator books for any patient
    else if (req.user.role === "operator") {
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: "Patient ID is required",
        });
      }

      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Prevent duplicate appointment
    const existingAppointment = await Appointment.findOne({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate,
      appointmentTime,
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already booked for this slot",
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate,
      appointmentTime,
      symptoms,
      status: "Pending",
    });

    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("patient", "name email phone")
      .populate(
        "doctor",
        "name specialization hospital consultationFee"
      );

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment: populatedAppointment,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== GET PATIENT APPOINTMENTS ======================

const getPatientAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate(
        "doctor",
        "name specialization qualification hospital consultationFee phone"
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

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
// ====================== GET DOCTOR APPOINTMENTS ======================

const getDoctorAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate(
        "patient",
        "name email age gender phone address"
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

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

// ====================== UPDATE APPOINTMENT STATUS ======================

const updateAppointmentStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Doctor can update only their own appointments
    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Operator can update any appointment
    if (
      req.user.role !== "doctor" &&
      req.user.role !== "operator"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedStatus = [
      "Pending",
      "Accepted",
      "Rejected",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status",
      });
    }

    appointment.status = status;

    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("patient", "name email phone age gender")
      .populate(
        "doctor",
        "name specialization qualification hospital consultationFee"
      );

    res.status(200).json({
      success: true,
      message: `Appointment ${status} Successfully`,
      appointment: updatedAppointment,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ====================== CANCEL APPOINTMENT ======================

const cancelAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Patient can cancel only their own appointment
    if (
      req.user.role === "patient" &&
      appointment.patient.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Doctor can cancel only their own appointment
    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Operator can cancel any appointment
    if (
      req.user.role !== "patient" &&
      req.user.role !== "doctor" &&
      req.user.role !== "operator"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully",
      appointment,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ====================== RESCHEDULE APPOINTMENT ======================

const rescheduleAppointment = async (req, res) => {
  try {

    const { id } = req.params;
    const { appointmentDate, appointmentTime } = req.body;

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Date and Time are required",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only Operator can reschedule
    if (req.user.role !== "operator") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if another appointment already exists
    const existingAppointment = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      appointmentDate,
      appointmentTime,
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    appointment.appointmentDate = appointmentDate;
    appointment.appointmentTime = appointmentTime;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization");

    res.status(200).json({
      success: true,
      message: "Appointment Rescheduled Successfully",
      appointment: updatedAppointment,
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
      .populate(
        "patient",
        "name email phone age gender address"
      )
      .populate(
        "doctor",
        "name specialization qualification consultationFee"
      )
      .sort({
        appointmentDate: 1,
        appointmentTime: 1,
      });

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

// ====================== EXPORTS ======================

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
};