const Report = require("../models/Report");

// ====================== Upload Report ======================

const uploadReport = async (req, res) => {
  try {
    const { patient, appointment, reportName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a report file",
      });
    }

    const report = await Report.create({
      patient,
      appointment,
      reportName,
      reportFile: req.file.path,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== Get All Reports ======================

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "name")
      .populate("appointment")
      .populate("uploadedBy", "name");

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== Get Reports By Patient ======================

const getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({
      patient: req.params.patientId,
    })
      .populate("patient", "name")
      .populate("uploadedBy", "name");

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== Delete Report ======================

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================== Exports ======================

module.exports = {
  uploadReport,
  getAllReports,
  getPatientReports,
  deleteReport,
};