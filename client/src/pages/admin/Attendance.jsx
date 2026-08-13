import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaCalendarAlt } from "react-icons/fa";
import {
  getAllStudents,
  getAttendanceByDate,
  markAttendance,
} from "../../services/adminService";

const statusOptions = ["Present", "Absent", "Leave"];

function getTodayString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function Attendance() {
  const [date, setDate] = useState(getTodayString());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await getAttendanceByDate(date);

      setRecords(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        date,
        records: records
          .filter((r) => r.status !== "Not Marked")
          .map((r) => ({
            studentId: r.studentId,
            status: r.status,
          })),
      };

      if (payload.records.length === 0) {
        toast.warning("Mark at least one student before saving.");
        return;
      }

      await markAttendance(payload);

      toast.success("Attendance saved successfully.");

      fetchAttendance();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      Present: "bg-green-100 text-green-700",
      Absent: "bg-red-100 text-red-700",
      Leave: "bg-yellow-100 text-yellow-700",
      "Not Marked": "bg-gray-100 text-gray-500",
    };
    return map[status] || map["Not Marked"];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Attendance Management
          </h2>
          <p className="text-gray-500 mt-1">
            Mark and manage daily student attendance.
          </p>
        </div>

        <div className="flex items-center bg-white rounded-lg shadow px-4 py-3 gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <input
            type="date"
            value={date}
            max={getTodayString()}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Students ({records.length})</h3>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading students...
          </div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No active students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Board</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4">Mark As</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item) => (
                  <tr
                    key={item.studentId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">{item.className}</td>
                    <td className="p-4">{item.board}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              handleStatusChange(item.studentId, opt)
                            }
                            className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${
                              item.status === opt
                                ? opt === "Present"
                                  ? "bg-green-600 text-white border-green-600"
                                  : opt === "Absent"
                                    ? "bg-red-600 text-white border-red-600"
                                    : "bg-yellow-500 text-white border-yellow-500"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
