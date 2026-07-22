const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ====================== Routes ======================

const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ====================== Middleware ======================

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.PRODUCTION_URL ||
    "https://ai-hospital-mangement-system.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS policy does not allow access from this origin.")
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================== MongoDB Connection ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log("📂 Database Name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log(
      `🌍 Environment: ${process.env.NODE_ENV || "development"}`
    );
    console.log("====================================");
  })
  .catch((err) => {
    console.error("====================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
    console.error("====================================");
    process.exit(1);
  });

// ====================== Home Route ======================

app.get("/", (req, res) => {
  res.send("AI Hospital Management Backend is Running 🚀");
});

// ====================== API Health Check ======================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Connected Successfully",
  });
});

// ====================== API Routes ======================

app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

// ====================== Global Error Handler ======================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ====================== Handle Invalid Routes ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ====================== Server ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(
    `🌍 Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log("====================================");
});