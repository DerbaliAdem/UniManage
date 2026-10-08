import { useState } from "react";
import { Check, Search, Wrench } from "lucide-react";
import { initialRooms, type AdminRoom, type RoomStatus } from "../../services/mockAdminData";

const statusClasses: Record<RoomStatus, string> = {
  Available: "border-green-900 bg-green-950/40 text-green-300",
  Occupied: "border-blue-900 bg-blue-950/40 text-blue-300",
  Offline: "border-red-900 bg-red-950/40 text-red-300",
  Maintenance: "border-amber-900 bg-amber-950/40 text-amber-300",
};

function AdminRooms() {
  const [rooms, setRooms] = useState<AdminRoom[]>(initialRooms);
  const [query, setQuery] = useState("");
  const [savedRoom, setSavedRoom] = useState<string | null>(null);
  const suggestions = rooms.filter((room) => room.status === "Available" && room.capacity >= 30);
  const filteredRooms = rooms.filter((room) => room.id.toLowerCase().includes(query.trim().toLowerCase()));

  const updateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((current) => current.map((room) => room.id === roomId ? { ...room, status } : room));
    setSavedRoom(roomId);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Room management</h1>
        <p className="mt-2 text-gray-400">Check room availability and record room issues.</p>

        <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><Wrench size={18} className="text-gray-400" /><h2 className="font-semibold">Room suggestions</h2></div><p className="mt-1 text-sm text-gray-500">Web Development · Monday 10:00–12:00 · 30 students</p></div><span className="text-xs text-gray-500">Capacity and current status checked</span></div>
          {suggestions.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{suggestions.map((room) => <article key={room.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-950 p-4"><div><p className="font-medium">Room {room.id}</p><p className="mt-1 text-sm text-gray-500">{room.capacity} seats · available at the selected time</p></div><span className="rounded-full bg-green-950/60 px-2.5 py-1 text-xs text-green-300">Suitable</span></article>)}</div> : <p className="mt-4 rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-200">No available room has enough seats for this class. Review room status or adjust the schedule.</p>}
          <p className="mt-3 text-xs text-gray-600">Suggestions use sample room status and capacity only; timetable conflicts and equipment are not checked yet.</p>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="font-semibold">Campus rooms</h2><p className="mt-1 text-xs text-gray-500">Update a room’s operational status.</p></div><label className="relative block sm:w-64"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><span className="sr-only">Search rooms</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search room number" className="w-full rounded-lg border border-gray-700 bg-gray-950 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-gray-600 focus:border-blue-500" /></label></div>
          <div className="divide-y divide-gray-800">{filteredRooms.map((room) => <article key={room.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:px-5"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">Room {room.id}</h3><span className={`rounded-full border px-2 py-0.5 text-xs ${statusClasses[room.status]}`}>{room.status}</span></div><p className="mt-1 text-sm text-gray-500">Capacity: {room.capacity}</p>{room.status === "Occupied" && room.currentClass && <p className="mt-1 text-xs text-gray-400">{room.currentClass} · {room.teacher} · {room.group} · {room.time}</p>}{(room.status === "Offline" || room.status === "Maintenance") && <p className="mt-1 text-xs text-amber-300">Requires operational follow-up</p>}</div><label className="text-xs text-gray-500">Update status<select value={room.status} onChange={(event) => updateRoomStatus(room.id, event.target.value as RoomStatus)} className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 sm:max-w-52">{(["Available", "Occupied", "Offline", "Maintenance"] as const).map((status) => <option key={status}>{status}</option>)}</select></label><div className="min-h-5 text-xs text-green-400" role="status">{savedRoom === room.id && <span className="inline-flex items-center gap-1"><Check size={14} /> Status updated in this demo</span>}</div></article>)}{filteredRooms.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-500">No rooms match “{query}”.</p>}</div>
        </section>
        <p className="mt-4 text-xs text-gray-600">Room status changes are held in the browser session and are not saved to a backend.</p>
      </div>
    </div>
  );
}

export default AdminRooms;
