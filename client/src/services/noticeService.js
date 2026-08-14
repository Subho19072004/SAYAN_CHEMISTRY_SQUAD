import API from "../api/axios";

export const getAllNotices = () => {
  return API.get("/notices");
};

export const createNotice = (data) => {
  return API.post("/notices", data);
};

export const updateNotice = (id, data) => {
  return API.put(`/notices/${id}`, data);
};

export const deleteNotice = (id) => {
  return API.delete(`/notices/${id}`);
};