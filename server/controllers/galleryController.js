import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "sayan-chemistry-squad/gallery",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(req.file.buffer);
    });

    // Save Cloudinary URL in MongoDB
    const gallery = await Gallery.create({
      title: req.body.title,
      image: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Images
export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Image
export const deleteImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete image from Cloudinary
    if (gallery.publicId) {
      await cloudinary.uploader.destroy(gallery.publicId);
    }

    // Delete record from MongoDB
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
