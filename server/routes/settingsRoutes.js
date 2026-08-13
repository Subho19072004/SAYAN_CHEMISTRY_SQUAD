import express from "express";
import multer from "multer";
import path from "path";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// ===============================
// Multer Storage
// ===============================

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

// ===============================
// Routes
// ===============================

// Get Settings
router.get("/", getSettings);

// Update Settings
router.put(
  "/",
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  updateSettings,
);

export default router;
