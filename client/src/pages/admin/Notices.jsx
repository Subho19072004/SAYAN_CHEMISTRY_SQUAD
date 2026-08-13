import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../../services/noticeService";

function Notices() {
  // =========================
  // States
  // =========================

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    fetchNotices();
  }, []);

  // =========================
  // Fetch Notices
  // =========================

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await getAllNotices();

      const sortedNotices = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setNotices(sortedNotices);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notices.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Search Filter
  // =========================

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(search.toLowerCase()),
  );

  // =========================
  // Pagination
  // =========================

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;

  const currentNotices = filteredNotices.slice(
    indexOfFirstNotice,
    indexOfLastNotice,
  );

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  // =========================
  // Add / Update Notice
  // =========================

  const handleSubmit = async () => {
    if (formData.title.trim() === "" || formData.description.trim() === "") {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      if (editingId) {
        await updateNotice(editingId, formData);
        toast.success("Notice updated successfully.");
      } else {
        await createNotice(formData);
        toast.success("Notice added successfully.");
      }

      setFormData({
        title: "",
        description: "",
      });

      setEditingId(null);

      fetchNotices();

      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  // =========================
  // Edit Notice
  // =========================

  const handleEdit = (notice) => {
    setEditingId(notice._id);

    setFormData({
      title: notice.title,
      description: notice.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete Notice
  // =========================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Notice?",
      text: "This notice will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteNotice(id);

      toast.success("Notice deleted successfully.");

      fetchNotices();

      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  // =========================
  // Loading Spinner
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ================= Header ================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Notice Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, update and manage all notices.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search notice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-72 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= Add / Update Form ================= */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          {editingId ? "Update Notice" : "Add New Notice"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Notice Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <textarea
            rows="5"
            placeholder="Notice Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              {editingId ? "Update Notice" : "Add Notice"}
            </button>

            <button
              onClick={() => {
                setEditingId(null);

                setFormData({
                  title: "",
                  description: "",
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* ================= Notice List ================= */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Notices</h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          Total Notices : {filteredNotices.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-center">#</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-center">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  {search
                    ? "No matching notice found."
                    : "No notices available."}
                </td>
              </tr>
            ) : (
              currentNotices.map((notice, index) => (
                <tr
                  key={notice._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-center font-medium">
                    {indexOfFirstNotice + index + 1}
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {notice.title}
                  </td>

                  <td className="p-4 max-w-md" title={notice.description}>
                    {notice.description.length > 80
                      ? notice.description.substring(0, 80) + "..."
                      : notice.description}
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* ================= Pagination ================= */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-5 border-t bg-gray-50">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-blue-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notices;
