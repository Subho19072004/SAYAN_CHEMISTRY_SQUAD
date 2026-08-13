import Gallery from "../models/Gallery.js";

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    const gallery = await Gallery.create({
      title: req.body.title,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: gallery,
    });
  } catch (error) {
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
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
