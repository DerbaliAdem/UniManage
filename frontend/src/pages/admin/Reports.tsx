import { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import { behaviorReports } from "../../services/mockAdminData";

function AdminReports() {
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const reports = behaviorReports.map((report) => reviewedIds.includes(report.id) ? { ...report, status: "Reviewed" } : report);
  const markReviewed = (id: string) => setReviewedIds((current) => current.includes(id) ? current : [...current, id]);
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
      <p className="text-sm font-medium text-blue-400">ADMINISTRATION</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Reports</h1><p className="mt-2 text-gray-400">Review behavior concerns submitted by teachers.</p>
      <section className="mt-7 overflow-hidden rounded-xl border border-gray-800 bg-gray-900"><div className="flex items-center gap-2 border-b border-gray-800 p-4 sm:px-5"><ClipboardList size={18} className="text-gray-500" /><div><h2 className="font-semibold">Teacher submissions</h2><p className="mt-1 text-xs text-gray-500">{reports.filter((report) => report.status === "Needs review").length} need review</p></div></div>
        <div className="divide-y divide-gray-800">{reports.map((report) => <article key={report.id} className="p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{report.type}</h3><span className={`rounded-full px-2.5 py-1 text-xs ${report.severity === "High" ? "bg-red-950/50 text-red-300" : report.severity === "Medium" ? "bg-amber-950/50 text-amber-300" : "bg-gray-800 text-gray-300"}`}>{report.severity} severity</span><span className={`rounded-full px-2.5 py-1 text-xs ${report.status === "Needs review" ? "bg-blue-950/50 text-blue-300" : "bg-green-950/50 text-green-300"}`}>{report.status}</span></div><p className="mt-2 text-sm text-gray-300">Student: {report.student}</p><p className="mt-1 text-xs text-gray-500">{report.id} · Submitted by {report.teacher} · {report.date}</p></div>{report.status === "Needs review" && <button type="button" onClick={() => markReviewed(report.id)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"><Check size={15} /> Mark reviewed</button>}</div></article>)}</div>
      </section><p className="mt-4 text-xs text-gray-600">Report records are sample data. Review status changes stay in this browser session and are not an administrator decision stored by a server.</p>
    </div></div>
  );
}

export default AdminReports;
