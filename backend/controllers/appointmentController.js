const Appointment = require("../models/Appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/Doctor");

// ====================== BOOK APPOINTMENT ======================

const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      symptoms,
    } = req.body;

    // ====================== Validate Input ======================

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor, Date and Time are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret is not configured",
      });
    }

    // Validate Appointment Date
    const selectedDate = new Date(appointmentDate);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // Prevent Past Appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date cannot be in the past",
      });
    }

    // ====================== Check Patient ======================

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // ====================== Check Doctor ======================

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ====================== Check Doctor Availability Day ======================

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (
      doctor.availableDays &&
      doctor.availableDays.length > 0 &&
      !doctor.availableDays.includes(dayName)
    ) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available on this day",
      });
    }

    // ====================== Check Doctor Availability Time ======================

    if (
      doctor.availableTime?.start &&
      doctor.availableTime?.end &&
      (
        appointmentTime < doctor.availableTime.start ||
        appointmentTime > doctor.availableTime.end
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected time is outside doctor's working hours",
      });
    }

    // ====================== Prevent Duplicate Appointment ======================

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

    // ====================== Create Appointment ======================

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      appointmentDate,
      appointmentTime,
      symptoms: symptoms?.trim() || "",
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

    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This appointment slot is already booked.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    if (appointment.doctor.toString() !== req.user.id) {
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

    if (notes !== undefined) {
      appointment.notes = notes.trim();
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
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

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
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

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};