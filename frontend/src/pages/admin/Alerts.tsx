import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import { adminStudents } from "../../services/mockAdminData";

function AdminAlerts() {
  const [notificationDemoIds, setNotificationDemoIds] = useState<string[]>([]);
  const flaggedStudents = adminStudents.filter((student) => student.attendance <= 80);
  const markNotified = (id: string) => setNotificationDemoIds((current) => current.includes(id) ? current : [...current, id]);
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
      <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Attendance alerts</h1><p className="mt-2 text-gray-400">Students whose recorded attendance needs a closer look.</p>
      <div className="mt-6 flex gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" /><div><p className="text-sm font-medium">Transparent rule, sample records</p><p className="mt-1 text-sm text-gray-400">This prototype flags attendance at or below 80% for review, with 75% treated as the example minimum. It does not use a machine learning model and does not generate attendance history.</p></div></div>
      <section className="mt-6 space-y-3">{flaggedStudents.map((student) => { const belowLimit = student.attendance < 75; const notified = notificationDemoIds.includes(student.id); return <article key={student.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{student.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs ${belowLimit ? "bg-red-950/50 text-red-300" : "bg-amber-950/50 text-amber-300"}`}>{belowLimit ? "Below example minimum" : "Approaching minimum"}</span></div><p className="mt-1 text-sm text-gray-500">{student.id} · {student.group}</p><p className="mt-3 text-sm text-gray-300">Attendance: <strong className={belowLimit ? "text-red-300" : "text-amber-300"}>{student.attendance}%</strong> · Example minimum: 75%</p><p className="mt-1 text-sm text-gray-500">Reason: the sample attendance figure is {belowLimit ? "below" : "within 5 percentage points of"} the configured threshold.</p></div>{notified ? <span role="status" className="inline-flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={17} /> Demo notification marked</span> : <button type="button" onClick={() => markNotified(student.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2.5 text-sm text-gray-200 hover:bg-gray-800"><Bell size={16} /> Mark notification sent</button>}</div></article>; })}
        {flaggedStudents.length === 0 && <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"><CheckCircle2 size={24} className="mx-auto text-green-400" /><h2 className="mt-3 font-semibold">No attendance flags</h2><p className="mt-1 text-sm text-gray-500">No sample student is at or below the review threshold.</p></div>}
      </section><p className="mt-4 text-xs text-gray-600">Sample data only. Clicking the notification action does not send a message.</p>
    </div></div>
  );
}

export default AdminAlerts;
