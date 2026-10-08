import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { getApiErrorMessage } from "../../api/client";
import { getClassStudents, getTeacherSchedule, getBehaviorReports, submitBehaviorReport } from "../../api/teacherApi";
import type { BehaviorReport, ClassStudent, TeacherScheduleItem } from "../../types/api";

const initialForm = {
  studentId: "",
  classSessionId: "",
  reportType: "",
  severity: "MEDIUM" as const,
  description: "",
};

function TeacherReports() {
  const [schedule, setSchedule] = useState<TeacherScheduleItem[]>([]);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [reports, setReports] = useState<BehaviorReport[]>([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const [classes, existingReports] = await Promise.all([
          getTeacherSchedule(),
          getBehaviorReports(),
        ]);
        setSchedule(classes);
        setReports(existingReports);
      } catch {
        setStatus({ type: "error", text: "Unable to load your reports." });
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, []);

  useEffect(() => {
    if (!form.classSessionId) {
      setStudents([]);
      return;
    }

    const loadRoster = async () => {
      try {
        const roster = await getClassStudents(form.classSessionId);
        setStudents(roster);
      } catch {
        setStatus({ type: "error", text: "Unable to load students for this class." });
      }
    };

    void loadRoster();
  }, [form.classSessionId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.studentId || !form.description.trim()) {
      setStatus({ type: "error", text: "Please select a student and describe the issue." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      await submitBehaviorReport({
        studentId: form.studentId,
        classSessionId: form.classSessionId,
        reportType: form.reportType,
        severity: form.severity,
        description: form.description,
      });
      setForm(initialForm);
      setStudents([]);
      setStatus({ type: "success", text: "Report submitted successfully." });
      try {
        const refreshedReports = await getBehaviorReports();
        setReports(refreshedReports);
      } catch {
        setStatus({ type: "success", text: "Report submitted successfully. The report list could not be refreshed." });
      }
    } catch (errorValue) {
      setStatus({ type: "error", text: getApiErrorMessage(errorValue, "Unable to submit report. Please try again.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
          <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">Loading behavior reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Behavior reports</h1>
        <p className="mt-2 text-gray-400">Send a serious student conduct concern to the administration team.</p>
        <div className="mt-6 flex gap-3 rounded-xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <p>Report any significant student concern that needs follow-up.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-gray-300">Class
              <select
                required
                value={form.classSessionId}
                onChange={(event) => setForm((current) => ({ ...current, classSessionId: event.target.value, studentId: "" }))}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select class</option>
                {schedule.map((item) => (
                  <option key={item.id ?? `${item.subject}-${item.startTime}`} value={item.id ?? ""}>
                    {item.subject ?? "Class"} · {item.groupName ?? "Group"}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-gray-300">Student
              <select
                required
                value={form.studentId}
                onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))}
                disabled={!form.classSessionId}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                <option value="" disabled>{form.classSessionId ? "Select student" : "Choose a class first"}</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>{student.fullName} · {student.studentNumber}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-gray-300">Concern type
              <select
                required
                value={form.reportType}
                onChange={(event) => setForm((current) => ({ ...current, reportType: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select type</option>
                <option value="DISRUPTIVE_BEHAVIOR">Disruptive behavior</option>
                <option value="REPEATED_LATENESS">Repeated lateness</option>
                <option value="INAPPROPRIATE_BEHAVIOR">Inappropriate behavior</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="text-sm text-gray-300">Severity
              <select
                required
                value={form.severity}
                onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as typeof form.severity }))}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-gray-300">What happened?
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Describe the incident factually, including relevant context."
              className="mt-2 w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />
            <span className="mt-1 block text-right text-xs text-gray-600">{form.description.length}/1000</span>
          </label>

          {status && (
            <p role="status" className={`flex items-center gap-2 text-sm ${status.type === "success" ? "text-green-400" : "text-red-300"}`}>
              <CheckCircle2 size={17} /> {status.text}
            </p>
          )}

          <div className="flex justify-end border-t border-gray-800 pt-4">
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800">
              {isSubmitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>

        {reports.length > 0 && (
          <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">Recent reports</h2>
            <div className="mt-4 space-y-3">
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{report.studentName}</p>
                    <span className="rounded-full border border-gray-700 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-300">{report.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{report.reportType}</p>
                  <p className="mt-2 text-sm text-gray-300">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherReports;
