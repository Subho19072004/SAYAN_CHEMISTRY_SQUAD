import express from "express";
import multer from "multer";

import {
  uploadImage,
  getGallery,
  deleteImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// Store uploaded image temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post("/", upload.single("image"), uploadImage);
router.get("/", getGallery);
router.delete("/:id", deleteImage);

export default router;
