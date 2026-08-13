import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

import admissionRoutes from "./routes/admissionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

/* =====================================================
   ENVIRONMENT CHECK
===================================================== */

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

/* =====================================================
   DATABASE CONNECTION
===================================================== */

connectDB();

/* =====================================================
   MIDDLEWARE
===================================================== */

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =====================================================
   STATIC FILES
===================================================== */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =====================================================
   API ROUTES
===================================================== */

app.use("/api/admissions", admissionRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/notices", noticeRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/attendance", attendanceRoutes);

/* =====================================================
   DEFAULT API ROUTE
===================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully",
  });
});

/* =====================================================
   404 ROUTE
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =====================================================
   START SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔐 Admin API: /api/admin`);
  console.log(`🎓 Student API: /api/student`);
  console.log(`📅 Attendance API: /api/attendance`);
  console.log("=================================");
});
