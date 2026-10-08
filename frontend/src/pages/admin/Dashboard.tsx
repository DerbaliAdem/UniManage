import { AlertTriangle, ArrowRight, Building2, CalendarClock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { behaviorReports, initialRooms } from "../../services/mockAdminData";

const metrics = [
  { label: "Occupied rooms", value: initialRooms.filter((room) => room.status === "Occupied").length, note: "Rooms in use", icon: Building2 },
  { label: "Available rooms", value: initialRooms.filter((room) => room.status === "Available").length, note: "Ready to assign", icon: Building2 },
  { label: "Room issues", value: initialRooms.filter((room) => room.status === "Offline" || room.status === "Maintenance").length, note: "Offline or maintenance", icon: AlertTriangle },
  { label: "Reports to review", value: behaviorReports.filter((report) => report.status === "Needs review").length, note: "Teacher submissions", icon: Users },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">University overview</h1>
        <p className="mt-2 text-gray-400">A quick view of room use and items that need follow-up.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, note, icon: Icon }) => <article key={label} className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-sm text-gray-400">{label}</p><Icon size={18} className="text-gray-500" /></div><p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-gray-500">{note}</p></article>)}</div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4 sm:px-5"><div><h2 className="font-semibold">Room status</h2><p className="mt-1 text-xs text-gray-500">Sample building inventory</p></div><Link to="/admin/rooms" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">All rooms <ArrowRight size={15} /></Link></div>
            <div className="divide-y divide-gray-800">{initialRooms.map((room) => <div key={room.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"><div className="min-w-0"><p className="font-medium">Room {room.id}</p><p className="truncate text-xs text-gray-500">{room.currentClass ?? `${room.capacity} seats`}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${room.status === "Available" ? "bg-green-950/60 text-green-300" : room.status === "Occupied" ? "bg-blue-950/60 text-blue-300" : "bg-amber-950/60 text-amber-300"}`}>{room.status}</span></div>)}</div>
          </section>
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
            <div className="flex items-center gap-2"><CalendarClock size={18} className="text-gray-400" /><h2 className="font-semibold">Needs attention</h2></div>
            <ul className="mt-4 space-y-3">{initialRooms.filter((room) => room.status === "Offline" || room.status === "Maintenance").map((room) => <li key={room.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3"><p className="text-sm font-medium">Room {room.id} · {room.status}</p><p className="mt-1 text-xs text-gray-500">Check room readiness and affected classes.</p></li>)}{behaviorReports.filter((report) => report.status === "Needs review").map((report) => <li key={report.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3"><p className="text-sm font-medium">{report.type} · {report.student}</p><p className="mt-1 text-xs text-gray-500">{report.severity} severity · {report.date}</p></li>)}</ul>
            <Link to="/admin/reports" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">Review reports <ArrowRight size={15} /></Link>
          </section>
        </div>
        <p className="mt-5 text-xs text-gray-600">Dashboard figures are derived from prototype data and do not represent live campus activity.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
