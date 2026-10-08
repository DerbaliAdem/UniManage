import { AlertTriangle, Bell, Building2, CalendarDays, ClipboardList, LayoutDashboard, LogOut, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../api/authApi";

const navigation = [
  { label: "Dashboard", path: "/admin", end: true, icon: LayoutDashboard },
  { label: "Rooms", path: "/admin/rooms", icon: Building2 },
  { label: "Students", path: "/admin/students", icon: Users },
  { label: "Timetables", path: "/admin/schedules", icon: CalendarDays },
  { label: "Reports", path: "/admin/reports", icon: ClipboardList },
  { label: "AI Alerts", path: "/admin/alerts", icon: AlertTriangle },
];

type AdminSidebarProps = { onNavigate?: () => void };

function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-800 bg-gray-950 p-5 text-white">
      <div className="mb-8"><h1 className="text-2xl font-bold">UniManage</h1><p className="mt-1 text-sm text-gray-500">Administration</p></div>
      <nav aria-label="Administrator navigation" className="space-y-1.5">
        {navigation.map(({ label, path, end, icon: Icon }) => <NavLink key={path} to={path} end={end} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-gray-100"}`}><Icon size={17} />{label}</NavLink>)}
      </nav>
      <div className="mt-auto border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold">AD</div>
          <div><p className="text-sm font-medium">Admin user</p><p className="text-xs text-gray-500">Administrator</p></div>
          <Bell size={16} className="ml-auto text-gray-600" />
        </div>
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

export default AdminSidebar;
