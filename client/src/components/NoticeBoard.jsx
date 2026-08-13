import { useEffect, useState } from "react";
import { getAllNotices } from "../services/noticeService";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // =====================================================
  // FETCH NOTICES
  // =====================================================

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getAllNotices();

        if (res.data.success) {
          setNotices(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // =====================================================
  // SPLIT NOTICES INTO GROUPS OF 6
  // =====================================================

  const noticePages = [];

  for (let i = 0; i < notices.length; i += 6) {
    noticePages.push(notices.slice(i, i + 6));
  }

  // =====================================================
  // AUTOMATIC SLIDE
  // =====================================================

  useEffect(() => {
    if (noticePages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentPage((prev) =>
        prev === noticePages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [noticePages.length]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">Loading notices...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">
            📢 Notice Board
          </span>

          <h2 className="text-4xl font-bold text-gray-800 mt-4">
            Latest Notices
          </h2>

          <p className="text-gray-500 mt-2">
            Stay updated with the latest announcements.
          </p>
        </div>

        {/* =================================================
            NO NOTICES
        ================================================= */}

        {notices.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">No notices available at the moment.</p>
          </div>
        ) : (
          <>
            {/* =================================================
                CAROUSEL
            ================================================= */}

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {noticePages.map((page, pageIndex) => (
                  <div key={pageIndex} className="min-w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                      {page.map((notice) => (
                        <article
                          key={notice._id}
                          className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-47.5"
                        >
                          {/* =========================
                                NOTICE HEADER
                            ========================= */}

                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                              📢
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                                {notice.title}
                              </h3>

                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(notice.createdAt).toLocaleDateString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </div>

                          {/* =========================
                                DESCRIPTION
                            ========================= */}

                          <p className="text-gray-600 mt-5 leading-6 line-clamp-3">
                            {notice.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                SLIDE INDICATORS
            ================================================= */}

            {noticePages.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {noticePages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    aria-label={`Show notice page ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentPage === index
                        ? "w-8 bg-blue-600"
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default NoticeBoard;
