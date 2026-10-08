import { useState } from "react";
import { AlertTriangle, CalendarDays, MapPin } from "lucide-react";
import { initialRooms } from "../../services/mockAdminData";

const sessions = [
  { id: "CS-101", day: "Monday", subject: "Software Engineering", teacher: "Mr. Ahmed", group: "GLSI L3", room: "A101", start: "08:00", end: "10:00" },
  { id: "CS-102", day: "Monday", subject: "Web Development", teacher: "Mr. Karim", group: "GLSI L3", room: "A103", start: "10:00", end: "12:00" },
  { id: "CS-103", day: "Tuesday", subject: "Database Systems", teacher: "Mrs. Sara", group: "GLSI L2", room: "B204", start: "10:00", end: "12:00" },
  { id: "CS-104", day: "Wednesday", subject: "Networks", teacher: "Mr. Nabil", group: "GLSI L2", room: "A201", start: "14:00", end: "16:00" },
];
const days = ["All days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AdminSchedules() {
  const [selectedDay, setSelectedDay] = useState("All days");
  const unavailableRooms = new Set(initialRooms.filter((room) => room.status === "Offline" || room.status === "Maintenance").map((room) => room.id));
  const conflicts = sessions.filter((session) => unavailableRooms.has(session.room));
  const visibleSessions = sessions.filter((session) => selectedDay === "All days" || session.day === selectedDay);
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Timetables</h1><p className="mt-2 text-gray-400">Review scheduled classes and identify room availability problems.</p>
      {conflicts.length > 0 && <section className="mt-6 rounded-xl border border-amber-900/70 bg-amber-950/20 p-4 sm:p-5"><div className="flex gap-3"><AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-400" /><div><h2 className="font-semibold text-amber-200">{conflicts.length} class{conflicts.length === 1 ? "" : "es"} assigned to unavailable rooms</h2><p className="mt-1 text-sm text-amber-200/70">Review the affected sessions and approve any room or time changes before notifying people.</p><ul className="mt-3 space-y-2">{conflicts.map((item) => <li key={item.id} className="text-sm text-gray-200">{item.subject} · {item.day} {item.start}–{item.end} · Room {item.room}</li>)}</ul></div></div></section>}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900"><div className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex items-center gap-2"><CalendarDays size={18} className="text-gray-500" /><div><h2 className="font-semibold">Class sessions</h2><p className="mt-1 text-xs text-gray-500">{visibleSessions.length} sample sessions shown</p></div></div><label className="text-xs text-gray-500">Filter day<select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white sm:w-48"><option>All days</option>{days.slice(1).map((day) => <option key={day}>{day}</option>)}</select></label></div>
        <div className="divide-y divide-gray-800">{visibleSessions.map((session) => { const unavailable = unavailableRooms.has(session.room); return <article key={session.id} className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_170px] sm:items-center sm:px-5"><div className="text-sm tabular-nums text-gray-400">{session.day}<p className="mt-1 text-xs text-gray-600">{session.start}–{session.end}</p></div><div><h3 className="font-medium">{session.subject}</h3><p className="mt-1 text-sm text-gray-500">{session.teacher} · {session.group}</p></div><div className="flex items-center gap-2 text-sm"><MapPin size={15} className={unavailable ? "text-red-400" : "text-gray-500"} /><span className={unavailable ? "text-red-300" : "text-gray-300"}>Room {session.room}{unavailable ? " · Unavailable" : ""}</span></div></article>; })}{visibleSessions.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-500">No classes scheduled for this day in the sample data.</p>}</div></section>
      <p className="mt-4 text-xs text-gray-600">Conflict checks compare these sample sessions with the sample room status list. Changes are not applied automatically.</p>
    </div></div>
  );
}

export default AdminSchedules;
