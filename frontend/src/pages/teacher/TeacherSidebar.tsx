import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../api/authApi";
import { getStoredUser } from "../../api/client";

type TeacherSidebarProps = {
  onNavigate?: () => void;
};

function TeacherSidebar({ onNavigate }: TeacherSidebarProps) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const fullName = user?.fullName || user?.email || "Teacher";
  const initials = fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("") || "T";
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/teacher",
      exact: true,
    },
    {
      label: "Schedule",
      path: "/teacher/schedule",
      exact: false,
    },
    {
      label: "Attendance",
      path: "/teacher/attendance",
      exact: false,
    },
    {
      label: "Reports",
      path: "/teacher/reports",
      exact: false,
    },
  ];
  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-800 bg-gray-950 p-5 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          UniManage
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Teacher Portal
        </p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
            onClick={onNavigate}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-800 pt-4">
        <NavLink
          to="/teacher/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl p-3 transition ${
              isActive
                ? "bg-gray-800"
                : "hover:bg-gray-800"
            }`
          }
          onClick={onNavigate          }
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">{initials}</div>

          <div className="min-w-0">
            <p className="truncate font-medium">{fullName}</p>

            <p className="text-sm text-gray-500">
              {user?.role || "Teacher"}
            </p>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-900 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LogOut size={17} aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default TeacherSidebar;
