
import { NavLink } from "react-router-dom";

function StudentSidebar() {
  const navigationItems = [
    {
      label: "Dashboard",
      path: "/student",
      exact: true,
    },
    {
      label: "Timetable",
      path: "/student/timetable",
      exact: false,
    },
    {
      label: "Attendance",
      path: "/student/attendance",
      exact: false,
    },
    {
      label: "Notifications",
      path: "/student/notifications",
      exact: false,
    },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-800 bg-gray-950 p-5 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          UniManage
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Student Portal
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
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-800 pt-4">
        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl p-3 transition ${
              isActive
                ? "bg-gray-800"
                : "hover:bg-gray-800"
            }`
          }
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
            AD
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">
              Adam Derbali
            </p>

            <p className="text-sm text-gray-500">
              Student
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

export default StudentSidebar;

