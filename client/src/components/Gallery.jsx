import { useEffect, useRef, useState } from "react";
import { getGallery } from "../services/galleryService";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const scrollRef = useRef(null);

  // Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGallery();

        const images = response.data?.data || [];

        setGallery(images);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setGallery([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Continuous left scrolling
  useEffect(() => {
    if (!gallery.length || !scrollRef.current) return;

    const container = scrollRef.current;

    let animationFrame;
    let paused = false;

    const scroll = () => {
      if (!paused) {
        container.scrollLeft += 0.7;

        // Reset position for continuous scrolling
        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth - 1
        ) {
          container.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    const handleMouseEnter = () => {
      paused = true;
    };

    const handleMouseLeave = () => {
      paused = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);

      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gallery]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="text-center text-gray-500">Loading gallery...</div>
      </section>
    );
  }

  if (gallery.length === 0) {
    return null;
  }

  return (
    <>
      {/* Gallery Section */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 px-6">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
              📸 Our Gallery
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Our Gallery
            </h2>

            <p className="text-gray-500 mt-2">
              Explore moments from Sayan's Chemistry Squad.
            </p>
          </div>

          {/* Horizontal Scrolling Gallery */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden px-6 cursor-pointer"
          >
            {gallery.map((item) => {
              const imageUrl = item.image?.startsWith("http")
                ? item.image
                : `http://localhost:5000${item.image}`;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedImage(item)}
                  className="shrink-0 w-75 md:w-90 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  <img
                    src={imageUrl}
                    alt={item.title || "Gallery image"}
                    className="w-full h-60 object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

                  {item.title && (
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300"
              aria-label="Close"
            >
              ×
            </button>

            {/* Full Image */}
            <img
              src={
                selectedImage.image?.startsWith("http")
                  ? selectedImage.image
                  : `http://localhost:5000${selectedImage.image}`
              }
              alt={selectedImage.title || "Gallery image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image Title */}
            {selectedImage.title && (
              <div className="text-center text-white mt-4 text-lg font-semibold">
                {selectedImage.title}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
