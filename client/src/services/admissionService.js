import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const submitAdmission = (formData) => {
  return API.post("/admissions", formData);
};

export const getAllAdmissions = () => {
  return API.get("/admissions");
};

export const updateAdmission = (id, data) => {
  return API.put(`/admissions/${id}`, data);
};

export const deleteAdmission = (id) => {
  return API.delete(`/admissions/${id}`);
};
