import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  CalendarCheck,
  Bell,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Admissions",
      path: "/admin/admissions",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: <Users size={20} />,
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Notices",
      path: "/admin/notices",
      icon: <Bell size={20} />,
    },
    {
      name: "Gallery",
      path: "/admin/gallery",
      icon: <Image size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`relative min-h-screen bg-blue-700 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 bg-white text-blue-700 rounded-full shadow-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className="p-6 text-3xl font-bold border-b border-blue-600 flex items-center justify-center">
        {collapsed ? "AP" : "Admin Panel"}
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? "justify-center px-2" : "gap-3 px-6"
              } py-4 transition ${
                isActive ? "bg-blue-900" : "hover:bg-blue-800"
              }`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className={`flex items-center ${
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        } py-5 hover:bg-red-600 transition`}
      >
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
