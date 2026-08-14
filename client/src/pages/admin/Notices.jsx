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
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  // =====================================================
  // FETCH NOTICES
  // =====================================================

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response = await getAllNotices();

      console.log("GET NOTICES RESPONSE:", response.data);

      const data = response.data?.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid notices response from server.");
      }

      const sortedNotices = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setNotices(sortedNotices);
    } catch (error) {
      console.error("FETCH NOTICES ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load notices.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    fetchNotices();
  }, []);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE NOTICE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || !description) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const response = await updateNotice(editingId, {
          title,
          description,
        });

        console.log("UPDATE NOTICE RESPONSE:", response.data);

        toast.success("Notice updated successfully.");
      } else {
        const response = await createNotice({
          title,
          description,
        });

        console.log("CREATE NOTICE RESPONSE:", response.data);

        toast.success("Notice added successfully.");
      }

      setFormData({
        title: "",
        description: "",
      });

      setEditingId(null);
      setCurrentPage(1);

      await fetchNotices();
    } catch (error) {
      console.error("NOTICE SAVE ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT NOTICE
  // =====================================================

  const handleEdit = (notice) => {
    setEditingId(notice._id);

    setFormData({
      title: notice.title || "",
      description: notice.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const handleClear = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
    });
  };

  // =====================================================
  // DELETE NOTICE
  // =====================================================

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

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await deleteNotice(id);

      console.log("DELETE NOTICE RESPONSE:", response.data);

      toast.success("Notice deleted successfully.");

      await fetchNotices();

      setCurrentPage(1);
    } catch (error) {
      console.error("DELETE NOTICE ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredNotices = notices.filter((notice) => {
    const title = notice.title || "";
    const description = notice.description || "";

    const searchText = search.toLowerCase();

    return (
      title.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText)
    );
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

  const safeCurrentPage =
    totalPages > 0 && currentPage > totalPages ? totalPages : currentPage;

  const indexOfLastNotice = safeCurrentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;

  const currentNotices = filteredNotices.slice(
    indexOfFirstNotice,
    indexOfLastNotice,
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
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
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            className="w-72 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="button"
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

      {/* ADD / UPDATE FORM */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-5">
          {editingId ? "Update Notice" : "Add New Notice"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={formData.title}
              onChange={handleChange}
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            />

            <textarea
              name="description"
              rows="5"
              placeholder="Notice Description"
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg transition"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Notice"
                    : "Add Notice"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* NOTICE HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Notices</h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          Total Notices: {filteredNotices.length}
        </span>
      </div>

      {/* NOTICE TABLE */}
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
                      ? `${notice.description.substring(0, 80)}...`
                      : notice.description}
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {notice.createdAt
                      ? new Date(notice.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(notice)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
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

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-5 border-t bg-gray-50">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              safeCurrentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    safeCurrentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                totalPages > 0 ? Math.min(totalPages, page + 1) : 1,
              )
            }
            disabled={totalPages === 0 || safeCurrentPage === totalPages}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              totalPages === 0 || safeCurrentPage === totalPages
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
