const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ====================== Routes ======================

const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Operator & Reports
const operatorRoutes = require("./routes/operatorRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ====================== Middleware ======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-hospital-mangement-system.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS Origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ====================== MongoDB ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log("📂 Database Name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("====================================");
  })
  .catch((err) => {
    console.error("====================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
    console.error("====================================");
    process.exit(1);
  });

// ====================== Routes ======================

app.get("/", (req, res) => {
  res.send("AI Hospital Management Backend is Running 🚀");
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Backend Connected Successfully",
  });
});

app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/operator", operatorRoutes);
app.use("/api/report", reportRoutes);

// ====================== 404 ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ====================== Global Error Handler ======================

app.use((err, req, res, next) => {
  console.error("Global Error:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ====================== Server ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log("====================================");
});