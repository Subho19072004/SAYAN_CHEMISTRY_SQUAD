import { useEffect, useState } from "react";
import {
  getAllAdmissions,
  updateAdmission,
  deleteAdmission,
} from "../services/admissionService";

function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const res = await getAllAdmissions();
      setAdmissions(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAdmissions = admissions.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.mobile.includes(search);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatus = async (status) => {
    try {
      await updateAdmission(selectedStudent._id, { status });

      fetchAdmissions();

      setSelectedStudent({
        ...selectedStudent,
        status,
      });

      alert(`Admission ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admission?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAdmission(selectedStudent._id);

      fetchAdmissions();

      setShowModal(false);

      alert("Admission deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admission Applications</h1>

          <p className="text-gray-500 mt-1">
            Total Applications: {filteredAdmissions.length}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-3 w-full md:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Class</th>
              <th className="p-4 text-left">Board</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmissions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No admission applications found.
                </td>
              </tr>
            )}

            {filteredAdmissions.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{item.studentName}</td>

                <td className="p-4">{item.mobile}</td>

                <td className="p-4">{item.className}</td>

                <td className="p-4">{item.board}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full font-medium
                    ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedStudent(item);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6 border-b pb-3">
              Student Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <p>
                <strong>Student Name:</strong>
                <br />
                {selectedStudent.studentName}
              </p>

              <p>
                <strong>Parent Name:</strong>
                <br />
                {selectedStudent.parentName}
              </p>

              <p>
                <strong>Mobile:</strong>
                <br />
                {selectedStudent.mobile}
              </p>

              <p>
                <strong>WhatsApp:</strong>
                <br />
                {selectedStudent.whatsapp}
              </p>

              <p>
                <strong>Email:</strong>
                <br />
                {selectedStudent.email}
              </p>

              <p>
                <strong>School:</strong>
                <br />
                {selectedStudent.school}
              </p>

              <p>
                <strong>Class:</strong>
                <br />
                {selectedStudent.className}
              </p>

              <p>
                <strong>Board:</strong>
                <br />
                {selectedStudent.board}
              </p>

              <p className="md:col-span-2">
                <strong>Address:</strong>
                <br />
                {selectedStudent.address}
              </p>

              <p className="md:col-span-2">
                <strong>Message:</strong>
                <br />
                {selectedStudent.message || "No message provided"}
              </p>

              <p className="md:col-span-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full font-medium
                    ${
                      selectedStudent.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : selectedStudent.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {selectedStudent.status}
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatus("Approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => handleStatus("Rejected")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                >
                  ❌ Reject
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  🗑 Delete
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admissions;
