import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Calendar,
  Video,
  Bell,
  FileText,
  HelpCircle,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function StudentSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "My Courses",
      path: "/student/courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Assignments",
      path: "/student/assignments",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Attendance",
      path: "/student/attendance",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Calendar",
      path: "/student/calendar",
      icon: <Calendar size={20} />,
    },
    {
      name: "Live Classes",
      path: "/student/live-classes",
      icon: <Video size={20} />,
    },
    {
      name: "PDF Notes",
      path: "/student/pdf-notes",
      icon: <FileText size={20} />,
    },
    { name: "Quiz", path: "/student/quiz", icon: <HelpCircle size={20} /> },
    {
      name: "Notifications",
      path: "/student/notifications",
      icon: <Bell size={20} />,
    },
    { name: "Profile", path: "/student/profile", icon: <User size={20} /> },
    {
      name: "Settings",
      path: "/student/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`relative min-h-screen bg-blue-700 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 bg-white text-blue-700 rounded-full shadow-lg w-7 h-7 flex items-center justify-center hover:bg-gray-100"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-6 text-2xl font-bold border-b border-blue-600 flex items-center justify-center">
        {collapsed ? "SP" : "Student Portal"}
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? "justify-center px-2" : "gap-3 px-6"
              } py-4 transition ${isActive ? "bg-blue-900" : "hover:bg-blue-800"}`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
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

export default StudentSidebar;
