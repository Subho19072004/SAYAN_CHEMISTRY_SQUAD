import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaImages,
  FaUpload,
  FaTrash,
  FaSearch,
  FaClipboardList,
  FaUserGraduate,
  FaBullhorn,
  FaCog,
  FaSignOutAlt,
  FaSpinner,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  uploadImage,
  getGallery,
  deleteImage,
} from "../../services/galleryService";

function Gallery() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Upload States
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Gallery States
  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState("");

  // Loading States
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  // =============================
  // Fetch Gallery
  // =============================
  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await getGallery();

      setGallery(res.data.data || []);
    } catch (error) {
      console.log(error);

      toast.error("Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Image Preview
  // =============================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =============================
  // Upload Image
  // =============================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter image title.");
      return;
    }

    if (!image) {
      toast.warning("Please choose an image.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("image", image);

      await uploadImage(formData);

      toast.success("Image uploaded successfully.");

      setTitle("");
      setImage(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchGallery();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // Delete Image
  // =============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this image permanently?");

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteImage(id);

      toast.success("Image deleted successfully.");

      fetchGallery();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed.");
    } finally {
      setDeletingId("");
    }
  };

  // =============================
  // Logout
  // =============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  // =============================
  // Search
  // =============================
  const filteredGallery = gallery.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= Main Content ================= */}

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Gallery Management</h2>

            <p className="text-gray-500 mt-2">
              Upload and manage gallery images.
            </p>
          </div>

          <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm">Total Images</p>

            <h3 className="text-2xl font-bold">{gallery.length}</h3>
          </div>
        </div>

        {/* ================= Upload Card ================= */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-5">Upload New Image</h3>

          <form onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Enter Image Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mb-5"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-72 h-48 rounded-lg border shadow object-cover mb-5"
              />
            )}

            <button
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Image
                </>
              )}
            </button>
          </form>
        </div>

        {/* ================= Search ================= */}

        <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
          <div className="flex items-center border rounded-lg px-4 py-3">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search image..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ml-3 outline-none"
            />
          </div>
        </div>
        {/* ================= Gallery ================= */}

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <FaSpinner className="text-6xl text-blue-600 animate-spin mx-auto mb-5" />

            <h3 className="text-2xl font-semibold">Loading Gallery...</h3>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <FaImages className="text-7xl text-gray-300 mx-auto mb-5" />

            <h3 className="text-3xl font-bold text-gray-700">
              No Images Found
            </h3>

            <p className="text-gray-500 mt-3">
              Upload your first gallery image.
            </p>
          </div>
        ) : (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  onClick={() =>
                    window.open(`http://localhost:5000${item.image}`, "_blank")
                  }
                  className="w-full h-56 object-cover cursor-pointer"
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Uploaded on{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${item.image}`,
                          "_blank",
                        )
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FaEye />
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      {deletingId === item._id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FaTrash />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
