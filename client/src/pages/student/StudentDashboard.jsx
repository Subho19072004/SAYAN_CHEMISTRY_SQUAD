import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, CalendarCheck, Bell } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { getDashboardSummary } from "../../services/studentService";

function StudentDashboard() {
  const { student } = useAuth();

  const [stats, setStats] = useState({
    courses: 0,
    pendingAssignments: 0,
    attendancePercent: 0,
    notices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await getDashboardSummary();
        setStats(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {student?.name || "Student"} 👋
        </h2>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your studies today.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">My Courses</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {loading ? "-" : stats.courses}
              </p>
            </div>
            <BookOpen className="text-4xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Pending Assignments</h3>
              <p className="text-4xl font-bold text-yellow-500 mt-2">
                {loading ? "-" : stats.pendingAssignments}
              </p>
            </div>
            <ClipboardList className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Attendance</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {loading ? "-" : `${stats.attendancePercent}%`}
              </p>
            </div>
            <CalendarCheck className="text-4xl text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500">Notices</h3>
              <p className="text-4xl font-bold text-red-600 mt-2">
                {loading ? "-" : stats.notices}
              </p>
            </div>
            <Bell className="text-4xl text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
