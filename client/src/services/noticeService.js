import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllNotices = () => API.get("/notices");

export const createNotice = (data) => API.post("/notices", data);

export const updateNotice = (id, data) => API.put(`/notices/${id}`, data);

export const deleteNotice = (id) => API.delete(`/notices/${id}`);
