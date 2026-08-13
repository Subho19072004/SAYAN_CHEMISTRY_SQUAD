import { FaBell, FaSearch } from "react-icons/fa";

function DashboardNavbar() {
  return (
    <div className="bg-white shadow p-5 flex justify-between items-center rounded-lg">

      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">

        <FaSearch className="text-gray-500" />

        <input
          type="text"
          placeholder="Search courses..."
          className="bg-transparent outline-none ml-3"
        />

      </div>

      <div className="flex items-center gap-6">

        <FaBell className="text-2xl cursor-pointer" />

        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="profile"
          className="w-12 h-12 rounded-full"
        />

      </div>

    </div>
  );
}

export default DashboardNavbar;