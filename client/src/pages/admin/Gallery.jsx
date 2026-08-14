import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaImages,
  FaUpload,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  uploadImage,
  getGallery,
  deleteImage,
} from "../../services/galleryService";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

function Gallery() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // =====================================================
  // STATES
  // =====================================================

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  // =====================================================
  // SERVER URL CHECK
  // =====================================================

  useEffect(() => {
    console.log("SERVER BASE URL:", SERVER_BASE_URL);

    if (!SERVER_BASE_URL) {
      console.error("VITE_SERVER_BASE_URL is missing from client/.env");
    }
  }, []);

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await getGallery();

      console.log("GALLERY RESPONSE:", response.data);

      const data = response.data?.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid gallery response from server.");
      }

      setGallery(data);
    } catch (error) {
      console.error("FETCH GALLERY ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load gallery.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD GALLERY
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =====================================================
  // CLEAR UPLOAD FORM
  // =====================================================

  const clearUploadForm = () => {
    setTitle("");
    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  const handleUpload = async (event) => {
    event.preventDefault();

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

      formData.append("title", title.trim());
      formData.append("image", image);

      const response = await uploadImage(formData);

      console.log("UPLOAD RESPONSE:", response.data);

      toast.success("Image uploaded successfully.");

      clearUploadForm();

      await fetchGallery();
    } catch (error) {
      console.error("UPLOAD GALLERY ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message || error.message || "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this image permanently?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await deleteImage(id);

      console.log("DELETE RESPONSE:", response.data);

      toast.success("Image deleted successfully.");

      await fetchGallery();
    } catch (error) {
      console.error("DELETE GALLERY ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message || error.message || "Delete failed.",
      );
    } finally {
      setDeletingId("");
    }
  };

  // =====================================================
  // OPEN IMAGE
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    // Already an absolute URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Production backend
    return `${SERVER_BASE_URL}${imagePath}`;
  };

  const handleViewImage = (imagePath) => {
    const imageUrl = getImageUrl(imagePath);

    if (!imageUrl) {
      toast.error("Image URL not available.");
      return;
    }

    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredGallery = gallery.filter((item) => {
    const itemTitle = item.title || "";

    return itemTitle.toLowerCase().includes(search.toLowerCase());
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="text-6xl text-blue-600 animate-spin mx-auto mb-5" />

          <h3 className="text-2xl font-semibold">Loading Gallery...</h3>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Gallery Management
          </h2>

          <p className="text-gray-500 mt-2">
            Upload and manage gallery images.
          </p>
        </div>

        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="text-sm">Total Images</p>

          <h3 className="text-2xl font-bold">{gallery.length}</h3>
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-5">Upload New Image</h3>

        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Enter Image Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={uploading}
            className="w-full border rounded-lg p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            disabled={uploading}
            className="mb-5"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-72 h-48 rounded-lg border shadow object-cover mb-5"
            />
          )}

          <div className="flex gap-3">
            <button
              type="submit"
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

            <button
              type="button"
              onClick={clearUploadForm}
              disabled={uploading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-8">
        <div className="flex items-center border rounded-lg px-4 py-3">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search image..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full ml-3 outline-none"
          />
        </div>
      </div>

      {/* GALLERY */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <FaImages className="text-7xl text-gray-300 mx-auto mb-5" />

          <h3 className="text-3xl font-bold text-gray-700">No Images Found</h3>

          <p className="text-gray-500 mt-3">Upload your first gallery image.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredGallery.map((item) => {
            const imageUrl = getImageUrl(item.image);

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={imageUrl}
                  alt={item.title || "Gallery image"}
                  onError={(event) => {
                    console.error("IMAGE LOAD FAILED:", imageUrl);

                    event.currentTarget.style.display = "none";
                  }}
                  className="w-full h-56 object-cover cursor-pointer"
                  onClick={() => handleViewImage(item.image)}
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Uploaded on{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => handleViewImage(item.image)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <FaEye />
                      View
                    </button>

                    <button
                      type="button"
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Gallery;
