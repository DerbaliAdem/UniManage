import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ClipboardCheck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { getTeacherDashboard } from "../../api/teacherApi";
import type { TeacherDashboardData } from "../../types/api";

const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TeacherDashboard() {
  const [dashboard, setDashboard] = useState<TeacherDashboardData>({
    todayClasses: [],
    upcomingClasses: [],
    totalClassesToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTeacherDashboard();
        setDashboard(data);
      } catch {
        setError("Unable to load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const nextClass = dashboard.nextClass ?? dashboard.todayClasses[0] ?? dashboard.upcomingClasses[0];
  const nextDayLabel = nextClass?.dayOfWeek ? dayNames[nextClass.dayOfWeek] : "Today";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
          <div className="mt-8 animate-pulse rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="h-4 w-32 rounded bg-gray-800" />
            <div className="mt-5 h-8 w-52 rounded bg-gray-800" />
            <div className="mt-4 h-4 w-72 rounded bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good morning, Teacher</h1>
        <p className="mt-2 text-gray-400">Your teaching overview, with quick access to class attendance.</p>

        {error ? (
          <div className="mt-8 rounded-xl border border-red-900/80 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>
        ) : (
          <>
            <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-400">
                  <CalendarDays size={17} /> NEXT CLASS · {nextDayLabel.toUpperCase()}
                </div>
                <span className="rounded-full border border-blue-900 bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-300">
                  {dashboard.totalClassesToday > 0 ? "Upcoming" : "No classes today"}
                </span>
              </div>

              {nextClass ? (
                <>
                  <h2 className="mt-5 text-2xl font-semibold">{nextClass.subject ?? "Class"}</h2>
                  <p className="mt-2 text-gray-400">{nextClass.groupName ?? "Class group"} · {nextClass.startTime ?? "09:00"}–{nextClass.endTime ?? "10:00"}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-300">
                    <MapPin size={16} className="text-gray-500" /> Room {nextClass.roomCode ?? "TBD"}
                  </p>
                  <div className="mt-6 border-t border-gray-800 pt-5">
                    <Link to="/teacher/attendance" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
                      Take attendance <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-400">
                  No classes are scheduled for today.
                </div>
              )}
            </section>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link to="/teacher/schedule" className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
                <CalendarDays size={20} className="text-gray-400" />
                <h3 className="mt-4 font-semibold">View teaching schedule</h3>
                <p className="mt-1 text-sm text-gray-500">Check your weekly classes, groups, and rooms.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-blue-400">Open schedule <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
              </Link>
              <Link to="/teacher/attendance" className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
                <ClipboardCheck size={20} className="text-gray-400" />
                <h3 className="mt-4 font-semibold">Record attendance</h3>
                <p className="mt-1 text-sm text-gray-500">Mark students present or absent for a class.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-blue-400">Open attendance <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
