import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaClipboardList,
  FaImages,
  FaBullhorn,
  FaUserPlus,
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { getAllAdmissions } from "../../services/admissionService";

const Dashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH ADMISSIONS
  // =========================================================

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);

        const res = await getAllAdmissions();

        const data = res.data?.data || res.data || [];

        setAdmissions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load admissions:", error);
        setAdmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = useMemo(() => {
    const total = admissions.length;

    const pending = admissions.filter(
      (item) => item.status === "Pending",
    ).length;

    const approved = admissions.filter(
      (item) => item.status === "Approved",
    ).length;

    const rejected = admissions.filter(
      (item) => item.status === "Rejected",
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, [admissions]);

  // =========================================================
  // RECENT ADMISSIONS
  // =========================================================

  const recentAdmissions = useMemo(() => {
    return [...admissions]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0),
      )
      .slice(0, 5);
  }, [admissions]);

  // =========================================================
  // PERCENTAGES
  // =========================================================

  const approvedPercentage =
    stats.total > 0
      ? Math.round((stats.approved / stats.total) * 100)
      : 0;

  const pendingPercentage =
    stats.total > 0
      ? Math.round((stats.pending / stats.total) * 100)
      : 0;

  const rejectedPercentage =
    stats.total > 0
      ? Math.round((stats.rejected / stats.total) * 100)
      : 0;

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-100 p-5 lg:p-8">

      {/* =====================================================
          TOP WELCOME BANNER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-600 to-purple-600 p-7 lg:p-9 text-white shadow-xl">

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <FaChartLine />
              Admin Dashboard
            </div>

            <h1 className="mt-5 text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, Admin 👋
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Manage admissions, students, notices, gallery and
              institute settings from one powerful dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-md border border-white/10">
            <FaCalendarAlt className="text-xl" />

            <div>
              <p className="text-xs text-blue-100">
                Today
              </p>

              <p className="font-semibold">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-7">

        {/* Total */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Admissions
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {loading ? "—" : stats.total}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                All applications received
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xl group-hover:scale-110 transition">
              <FaUserGraduate />
            </div>
          </div>

          <div className="mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-full bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Pending */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-3 text-3xl font-bold text-amber-500">
                {loading ? "—" : stats.pending}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Awaiting review
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500 text-xl group-hover:scale-110 transition">
              <FaClock />
            </div>
          </div>

          <div className="mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{
                width: `${pendingPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Approved */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Approved
              </p>

              <h2 className="mt-3 text-3xl font-bold text-emerald-600">
                {loading ? "—" : stats.approved}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Successfully approved
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-xl group-hover:scale-110 transition">
              <FaCheckCircle />
            </div>
          </div>

          <div className="mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${approvedPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Rejected */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>

              <h2 className="mt-3 text-3xl font-bold text-red-600">
                {loading ? "—" : stats.rejected}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Applications rejected
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl group-hover:scale-110 transition">
              <FaTimesCircle />
            </div>
          </div>

          <div className="mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{
                width: `${rejectedPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-7">

        {/* ===================================================
            RECENT ADMISSIONS
        ==================================================== */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between p-6 border-b border-slate-100">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Admissions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest student applications
              </p>
            </div>

            <Link
              to="/admin/admissions"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading admissions...
            </div>
          ) : recentAdmissions.length === 0 ? (
            <div className="py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-2xl">
                <FaClipboardList />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No admissions yet
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                New applications will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">
                      Student
                    </th>

                    <th className="px-6 py-4">
                      Class
                    </th>

                    <th className="px-6 py-4">
                      Board
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentAdmissions.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                            {student.studentName
                              ?.charAt(0)
                              ?.toUpperCase() || "S"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {student.studentName || "Unknown"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {student.mobile || "No mobile"}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.className || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.board || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(student.createdAt)}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            student.status,
                          )}`}
                        >
                          {student.status || "Pending"}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Frequently used admin tools
            </p>
          </div>

          <div className="mt-6 space-y-3">

            <Link
              to="/admin/admissions"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-blue-50 hover:bg-blue-600 transition duration-300"
            >
              <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition">
                <FaUserPlus />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 group-hover:text-white">
                  Manage Admissions
                </p>

                <p className="text-xs text-slate-500 group-hover:text-blue-100">
                  Review student applications
                </p>
              </div>

              <FaArrowRight className="text-blue-500 group-hover:text-white" />
            </Link>

            <Link
              to="/admin/notices"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-purple-50 hover:bg-purple-600 transition duration-300"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition">
                <FaBullhorn />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 group-hover:text-white">
                  Manage Notices
                </p>

                <p className="text-xs text-slate-500 group-hover:text-purple-100">
                  Publish important announcements
                </p>
              </div>

              <FaArrowRight className="text-purple-500 group-hover:text-white" />
            </Link>

            <Link
              to="/admin/gallery"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-600 transition duration-300"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition">
                <FaImages />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 group-hover:text-white">
                  Manage Gallery
                </p>

                <p className="text-xs text-slate-500 group-hover:text-emerald-100">
                  Upload and manage photos
                </p>
              </div>

              <FaArrowRight className="text-emerald-500 group-hover:text-white" />
            </Link>

            <Link
              to="/admin/settings"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-500 transition duration-300"
            >
              <div className="h-11 w-11 rounded-xl bg-orange-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition">
                <FaChartLine />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 group-hover:text-white">
                  Website Settings
                </p>

                <p className="text-xs text-slate-500 group-hover:text-orange-100">
                  Configure website settings
                </p>
              </div>

              <FaArrowRight className="text-orange-500 group-hover:text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM INFORMATION
      ====================================================== */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* Admission Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Admission Overview
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stats.total} Applications
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FaChartLine />
            </div>

          </div>

          <div className="mt-6 space-y-4">

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">
                  Approved
                </span>

                <span className="font-semibold text-emerald-600">
                  {approvedPercentage}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${approvedPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">
                  Pending
                </span>

                <span className="font-semibold text-amber-600">
                  {pendingPercentage}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-400"
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">
                  Rejected
                </span>

                <span className="font-semibold text-red-600">
                  {rejectedPercentage}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{
                    width: `${rejectedPercentage}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Institute Info */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-sm p-6">

          <p className="text-sm text-slate-400">
            Institute
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Sayan's Chemistry Squad
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            Chemistry coaching for Class XI & XII students
            across WBCHSE, CBSE and ISC boards.
          </p>

          <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
            <FaMapMarkerAlt className="text-blue-400" />
            <span>Multiple Centres</span>
          </div>

          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Manage Institute
            <FaArrowRight />
          </Link>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                System Status
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                All Systems Active
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>

          <div className="mt-6 space-y-3">

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm text-slate-600">
                Admin Panel
              </span>

              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm text-slate-600">
                Database
              </span>

              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm text-slate-600">
                Website
              </span>

              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;