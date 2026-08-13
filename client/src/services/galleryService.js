import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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
