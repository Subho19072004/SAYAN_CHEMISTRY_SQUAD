import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBullhorn } from "react-icons/fa";
import { getAllNotices } from "../../services/noticeService";

function Notifications() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await getAllNotices();
      setNotices(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load notices.");
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h2>
      <p className="text-gray-500 mb-8">
        All announcements from Sayan's Chemistry Squad.
      </p>

      {notices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-16 text-center text-gray-500">
          No notices available right now.
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-md p-6 flex gap-4 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                <FaBullhorn />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600 mt-3 leading-6">
                  {notice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
