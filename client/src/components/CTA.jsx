import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-20">
      <div className="max-w-4xl mx-auto text-center px-6">

        <h2 className="text-5xl font-bold">
          Ready to Start Learning?
        </h2>

        <p className="mt-6 text-lg">
          Join thousands of learners and boost your career today.
        </p>

        <Link
          to="/register"
          className="inline-block mt-8 bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-200"
        >
          Join Now
        </Link>

      </div>
    </section>
  );
}

export default CTA;