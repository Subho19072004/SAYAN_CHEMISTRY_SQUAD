import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CalendarCheck, CheckCircle, XCircle, Clock } from "lucide-react";
import { getMyAttendance } from "../../services/studentService";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    attendancePercent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await getMyAttendance();

      setRecords(res.data.data.records || []);
      setStats(res.data.data.stats);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      Present: "bg-green-100 text-green-700",
      Absent: "bg-red-100 text-red-700",
      Leave: "bg-yellow-100 text-yellow-700",
    };
    return map[status] || "bg-gray-100 text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h2>
      <p className="text-gray-500 mb-8">Track your class attendance record.</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Total Classes</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.totalClasses}
              </p>
            </div>
            <CalendarCheck className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Present</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.presentCount}
              </p>
            </div>
            <CheckCircle className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Absent</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.absentCount}
              </p>
            </div>
            <XCircle className="text-3xl text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm">Attendance %</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {stats.attendancePercent}%
              </p>
            </div>
            <Clock className="text-3xl text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="text-xl font-semibold">Attendance History</h3>
        </div>

        {records.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No attendance records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(record.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                          record.status,
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {record.remarks || "-"}
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
