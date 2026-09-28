import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../pages/student/StudentSidebar";

function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-4 lg:hidden">
        <div>
          <h1 className="text-xl font-bold text-white">
            UniManage
          </h1>

          <p className="text-xs text-gray-500">
            Student Portal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <StudentSidebar />

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <StudentSidebar />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Content */}
      <main className="min-w-0 lg:hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;

