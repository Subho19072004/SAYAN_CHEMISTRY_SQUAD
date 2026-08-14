import API from "../api/axios";

// Upload Gallery Image
export const uploadImage = (formData) => {
  return API.post("/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get Gallery Images
export const getGallery = () => {
  return API.get("/gallery");
};

// Delete Gallery Image
export const deleteImage = (id) => {
  return API.delete(`/gallery/${id}`);
};
