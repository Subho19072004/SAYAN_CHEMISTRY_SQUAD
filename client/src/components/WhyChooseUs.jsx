import {
  FaChalkboardTeacher,
  FaSchool,
  FaClipboardCheck,
  FaFlask,
  FaBookOpen,
  FaUsers,
  FaSnowflake,
  FaProjectDiagram,
} from "react-icons/fa";

const features = [
  {
    icon: <FaChalkboardTeacher className="text-5xl text-blue-600" />,
    title: "Digital Smart Board",
    description:
      "Interactive smart board classes for better conceptual understanding.",
  },
  {
    icon: <FaSnowflake className="text-5xl text-cyan-600" />,
    title: "Air-Conditioned Classroom",
    description: "Comfortable AC classroom for a better learning experience.",
  },
  {
    icon: <FaClipboardCheck className="text-5xl text-green-600" />,
    title: "Monthly Mock Tests",
    description:
      "Regular tests to evaluate progress and improve board exam performance.",
  },
  {
    icon: <FaUsers className="text-5xl text-purple-600" />,
    title: "Doubt Clearing Sessions",
    description: "Dedicated sessions to solve every student's doubts.",
  },
  {
    icon: <FaProjectDiagram className="text-5xl text-orange-500" />,
    title: "Project Assistance",
    description: "Complete guidance for chemistry school projects.",
  },
  {
    icon: <FaFlask className="text-5xl text-red-500" />,
    title: "Practical Chemistry",
    description: "Discussion of experiments, practicals and viva preparation.",
  },
  {
    icon: <FaBookOpen className="text-5xl text-indigo-600" />,
    title: "WBCHSE • CBSE • ISC",
    description:
      "Special coaching for Class XI & XII students of all major boards.",
  },
  {
    icon: <FaSchool className="text-5xl text-pink-600" />,
    title: "Bengali & English Medium",
    description: "Classes available in both Bengali and English medium.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-20 bg-linear-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-blue-900">
            Why Choose Sayan's Chemistry Squad?
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Providing quality Chemistry education with modern teaching methods
            and personalized guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-center mb-5">{feature.icon}</div>

              <h3 className="text-xl font-bold text-blue-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
