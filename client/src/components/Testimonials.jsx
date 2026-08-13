const testimonials = [
  {
    name: "Rahul Sharma",
    review:
      "Best Chemistry coaching in Howrah. Sayan Sir explains every concept clearly. The mock tests helped me score much higher.",
  },
  {
    name: "Priya Das",
    review:
      "Excellent teaching style with Digital Smart Board classes. Every doubt is solved patiently.",
  },
  {
    name: "Amit Kumar",
    review:
      "Highly recommended for WBCHSE, CBSE and ISC students. Monthly tests and practical discussions are outstanding.",
  },
];

function Testimonials() {
  return (
    <section className="py-20 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-blue-900">
            What Our Students Say
          </h2>

          <p className="mt-3 text-gray-600">
            Genuine feedback from our students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border border-gray-100"
            >
              {/* Stars */}
              <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>

              {/* Badge */}
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ✔ Verified Google Review
              </span>

              {/* Review */}
              <p className="text-gray-600 leading-7 italic">"{item.review}"</p>

              {/* User */}
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-lg text-blue-900">{item.name}</h3>

                <p className="text-sm text-gray-500">Google Review</p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Button */}
        <div className="text-center mt-12">
          <a
            href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition"
          >
            View All Google Reviews →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
