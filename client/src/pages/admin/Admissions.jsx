import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaClipboardList,
  FaBullhorn,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

import {
  getAllAdmissions,
  updateAdmission,
  deleteAdmission,
} from "../../services/admissionService";

function Admissions() {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      const res = await getAllAdmissions();

      setAdmissions(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateAdmission(id, { status });

      fetchAdmissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admission?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAdmission(id);

      fetchAdmissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const stats = useMemo(() => {
    return {
      total: admissions.length,
      pending: admissions.filter((a) => a.status === "Pending").length,
      approved: admissions.filter((a) => a.status === "Approved").length,
      rejected: admissions.filter((a) => a.status === "Rejected").length,
    };
  }, [admissions]);

  const filteredAdmissions = admissions.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.studentName.toLowerCase().includes(keyword) ||
      item.mobile.includes(search) ||
      item.board.toLowerCase().includes(keyword) ||
      item.className.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main */}

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-2">Admissions</h2>

        <p className="text-gray-500 mb-8">Manage all admission requests.</p>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <FaUserGraduate className="text-blue-600 text-3xl mb-3" />
            <p className="text-gray-500">Total Admissions</p>
            <h2 className="text-4xl font-bold">{stats.total}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaClock className="text-yellow-500 text-3xl mb-3" />
            <p className="text-gray-500">Pending</p>
            <h2 className="text-4xl font-bold">{stats.pending}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaCheckCircle className="text-green-600 text-3xl mb-3" />
            <p className="text-gray-500">Approved</p>
            <h2 className="text-4xl font-bold">{stats.approved}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <FaTimesCircle className="text-red-600 text-3xl mb-3" />
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-4xl font-bold">{stats.rejected}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search by student, mobile, class or board..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ml-3 outline-none"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="text-xl font-semibold">Admission List</h3>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading admissions...
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No admissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-250">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Student</th>
                    <th className="text-left p-4">Parent</th>
                    <th className="text-left p-4">Mobile</th>
                    <th className="text-left p-4">Class</th>
                    <th className="text-left p-4">Board</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-center p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdmissions.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{item.studentName}</td>

                      <td className="p-4">{item.parentName}</td>

                      <td className="p-4">{item.mobile}</td>

                      <td className="p-4">{item.className}</td>

                      <td className="p-4">{item.board}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            item.status === "Approved"
                              ? "bg-green-500"
                              : item.status === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => handleStatus(item._id, "Approved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleStatus(item._id, "Rejected")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                          >
                            <FaTrash />
                            Delete
                          </button>
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
    </div>
  );
}

export default Admissions;
