import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "../pages/teacher/TeacherSidebar";

function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3 lg:hidden">
        <div>
          <p className="text-lg font-semibold">UniManage</p>
          <p className="text-xs text-gray-500">Teacher Portal</p>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-300 hover:bg-gray-800"
          aria-label="Open navigation"
          aria-expanded={isSidebarOpen}
          aria-controls="teacher-sidebar-mobile"
        >
          <Menu size={22} />
        </button>
      </header>

      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div
        id="teacher-sidebar-mobile"
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!isSidebarOpen}
      >
        <TeacherSidebar onNavigate={() => setIsSidebarOpen(false)} />
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="hidden lg:flex">
        <TeacherSidebar />
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
      <main className="min-w-0 lg:hidden"><Outlet /></main>
    </div>
  );
}

export default TeacherLayout;
