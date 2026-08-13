import React from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentHeader from "../components/student/StudentHeader";

function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <StudentHeader />

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
