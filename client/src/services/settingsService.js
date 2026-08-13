import API from "../api/axios";

// Get Settings
export const getSettings = () => {
  return API.get("/settings");
};

// Update Settings
export const updateSettings = (formData) => {
  return API.put("/settings", formData);
};
