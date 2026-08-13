import { FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function StudentHeader() {
  const { student } = useAuth();

  return (
    <div className="bg-white shadow p-5 flex justify-between items-center">
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-80">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-3 w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <FaBell className="text-2xl text-gray-600 cursor-pointer" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {student?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <span className="font-medium text-gray-700">
            {student?.name || "Student"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StudentHeader;
