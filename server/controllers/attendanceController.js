import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// ======================================================
// Helper: Normalize date to midnight (so same-day marks don't duplicate)
// ======================================================

const normalizeDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ======================================================
// MARK ATTENDANCE (Admin) - bulk upsert for a given date
// ======================================================

export const markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Date and attendance records are required",
      });
    }

    const attendanceDate = normalizeDate(date);

    const operations = records.map((record) => ({
      updateOne: {
        filter: {
          student: record.studentId,
          date: attendanceDate,
        },
        update: {
          $set: {
            status: record.status,
            remarks: record.remarks || "",
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ATTENDANCE FOR A DATE (Admin)
// ======================================================

export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendanceDate = normalizeDate(date);

    const students = await Student.find({ status: "Active" })
      .select("name email className board")
      .sort({ name: 1 });

    const records = await Attendance.find({ date: attendanceDate });

    const recordMap = {};
    records.forEach((r) => {
      recordMap[r.student.toString()] = r;
    });

    const merged = students.map((student) => ({
      studentId: student._id,
      name: student.name,
      email: student.email,
      className: student.className,
      board: student.board,
      status: recordMap[student._id.toString()]?.status || "Not Marked",
      remarks: recordMap[student._id.toString()]?.remarks || "",
    }));

    res.status(200).json({
      success: true,
      date: attendanceDate,
      data: merged,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET MY ATTENDANCE (Student)
// ======================================================

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id }).sort({
      date: -1,
    });

    const totalClasses = records.length;
    const presentCount = records.filter((r) => r.status === "Present").length;
    const absentCount = records.filter((r) => r.status === "Absent").length;
    const leaveCount = records.filter((r) => r.status === "Leave").length;

    const attendancePercent =
      totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

    res.status(200).json({
      success: true,
      data: {
        records,
        stats: {
          totalClasses,
          presentCount,
          absentCount,
          leaveCount,
          attendancePercent,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
