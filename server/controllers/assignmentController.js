import Assignment from "../models/Assignment.js";

// Create assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate, totalMarks, status } =
      req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description and due date are required",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      totalMarks,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("CREATE ASSIGNMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create assignment",
    });
  }
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("GET ASSIGNMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assignments",
    });
  }
};

// Get assignment by ID
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("GET ASSIGNMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assignment",
    });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("UPDATE ASSIGNMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update assignment",
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ASSIGNMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete assignment",
    });
  }
};
