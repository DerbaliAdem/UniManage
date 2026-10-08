import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { adminStudents } from "../../services/mockAdminData";

function AdminStudents() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All groups");
  const students = useMemo(() => adminStudents.filter((student) => {
    const matchesQuery = `${student.id} ${student.name} ${student.email}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (group === "All groups" || student.group === group);
  }), [query, group]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Students</h1><p className="mt-2 text-gray-400">Find student records and review attendance at a glance.</p>
      <section className="mt-7 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="font-semibold">Student directory</h2><p className="mt-1 text-xs text-gray-500">{students.length} records shown</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative block sm:w-64"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><span className="sr-only">Search students</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, or ID" className="w-full rounded-lg border border-gray-700 bg-gray-950 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-gray-600 focus:border-blue-500" /></label><label className="sr-only" htmlFor="student-group">Filter by group</label><select id="student-group" value={group} onChange={(event) => setGroup(event.target.value)} className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"><option>All groups</option><option>GLSI L2</option><option>GLSI L3</option></select></div></div>
        <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-gray-950/60 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3 font-medium">Student</th><th className="px-5 py-3 font-medium">Group</th><th className="px-5 py-3 font-medium">Attendance</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-gray-800">{students.map((student) => <tr key={student.id}><td className="px-5 py-4"><p className="font-medium text-gray-100">{student.name}</p><p className="mt-1 text-xs text-gray-500">{student.id} · {student.email}</p></td><td className="px-5 py-4 text-gray-300">{student.group}</td><td className="px-5 py-4"><span className={student.attendance < 75 ? "font-medium text-amber-300" : "text-gray-300"}>{student.attendance}%</span><div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-gray-800"><div className={`h-full rounded-full ${student.attendance < 75 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${student.attendance}%` }} /></div></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${student.status === "Review" ? "bg-amber-950/50 text-amber-300" : "bg-gray-800 text-gray-300"}`}>{student.status}</span></td></tr>)}</tbody></table></div>
        <div className="divide-y divide-gray-800 md:hidden">{students.map((student) => <article key={student.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium">{student.name}</h3><p className="mt-1 text-xs text-gray-500">{student.id} · {student.group}</p></div><span className={`rounded-full px-2.5 py-1 text-xs ${student.status === "Review" ? "bg-amber-950/50 text-amber-300" : "bg-gray-800 text-gray-300"}`}>{student.status}</span></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-gray-500">Attendance</span><span className={student.attendance < 75 ? "text-amber-300" : "text-gray-300"}>{student.attendance}%</span></div><p className="mt-1 truncate text-xs text-gray-600">{student.email}</p></article>)}</div>
        {students.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-500">No students match these filters.</p>}
      </section><p className="mt-4 text-xs text-gray-600">Sample student records. Attendance figures must be connected to verified attendance records before operational use.</p>
    </div></div>
  );
}

export default AdminStudents;
