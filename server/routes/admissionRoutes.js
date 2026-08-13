import express from "express";

import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admissionController.js";

const router = express.Router();

// Create Admission
router.post("/", createAdmission);

// Get All Admissions
router.get("/", getAllAdmissions);

// Get Single Admission
router.get("/:id", getAdmissionById);

// Update Admission
router.put("/:id", updateAdmission);

// Delete Admission
router.delete("/:id", deleteAdmission);

export default router;
