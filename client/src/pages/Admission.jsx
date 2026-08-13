import { useState } from "react";
import { submitAdmission } from "../services/admissionService";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    school: "",
    className: "",
    board: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await submitAdmission(formData);

      alert(res.data.message);

      setFormData({
        studentName: "",
        parentName: "",
        mobile: "",
        whatsapp: "",
        email: "",
        school: "",
        className: "",
        board: "",
        address: "",
        message: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-blue-50 py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-blue-900">
          Admission Form
        </h2>

        <p className="text-center text-gray-600 mt-3 mb-10">
          Fill in your details and we'll contact you shortly.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">Student Name</label>

            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Parent Name</label>

            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              placeholder="Enter parent name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Mobile Number</label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">WhatsApp Number</label>

            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Enter WhatsApp number"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">School Name</label>

            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter school name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Class</label>

            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              <option>Class XI</option>
              <option>Class XII</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Board</label>

            <select
              name="board"
              value={formData.board}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Board</option>
              <option>WBCHSE</option>
              <option>CBSE</option>
              <option>ISC</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">Address</label>

            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Message (Optional)
            </label>

            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional message..."
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-lg font-bold text-lg transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Admission Form"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Admission;
