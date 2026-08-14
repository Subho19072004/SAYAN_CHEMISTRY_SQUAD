// client/src/services/assignmentService.js

import API from "../api/axios";

// Get all assignments
export const getAllAssignments = () => {
  return API.get("/assignments");
};

// Get assignment by ID
export const getAssignmentById = (id) => {
  return API.get(`/assignments/${id}`);
};

// Create assignment
export const createAssignment = (data) => {
  return API.post("/assignments", data);
};

// Update assignment
export const updateAssignment = (id, data) => {
  return API.put(`/assignments/${id}`, data);
};

// Delete assignment
export const deleteAssignment = (id) => {
  return API.delete(`/assignments/${id}`);
};
