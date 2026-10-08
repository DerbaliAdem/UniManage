import { useEffect, useMemo, useState } from "react";
import { Check, CheckCheck, Save, Search, UserRoundCheck, Users } from "lucide-react";

import { getApiErrorMessage } from "../../api/client";
import { getAttendanceForSession, getClassStudents, getTeacherSchedule, submitAttendance } from "../../api/teacherApi";
import type { ClassStudent, TeacherScheduleItem } from "../../types/api";

type AttendanceStatus = "present" | "absent" | "unmarked";

const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TeacherAttendance() {
  const [schedule, setSchedule] = useState<TeacherScheduleItem[]>([]);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getTeacherSchedule();
        setSchedule(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id ?? "");
        }
      } catch {
        setError("Unable to load your class list. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSchedule();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setStatuses({});
      return;
    }

    const loadClassData = async () => {
      setIsLoading(true);
      setError("");
      setStudents([]);
      setStatuses({});
      try {
        const [roster, attendance] = await Promise.all([
          getClassStudents(selectedClassId),
          getAttendanceForSession(selectedClassId),
        ]);

        setStudents(roster);
        const nextStatuses: Record<string, AttendanceStatus> = {};
        for (const student of roster) {
          nextStatuses[student.studentId] = "unmarked";
        }

        for (const record of attendance) {
          nextStatuses[record.studentId] = record.status === "PRESENT" ? "present" : "absent";
        }

        setStatuses(nextStatuses);
        setSavedMessage("");
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, "Unable to load this class roster. Please try again."));
      } finally {
        setIsLoading(false);
      }
    };

    void loadClassData();
  }, [selectedClassId]);

  const selectedClass = schedule.find((item) => item.id === selectedClassId) ?? schedule[0];
  const visibleStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return students;
    return students.filter((student) => `${student.fullName} ${student.studentNumber}`.toLowerCase().includes(normalizedQuery));
  }, [query, students]);

  const presentCount = students.filter((student) => statuses[student.studentId] === "present").length;
  const absentCount = students.filter((student) => statuses[student.studentId] === "absent").length;
  const unmarkedCount = students.length - presentCount - absentCount;

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses((current) => ({ ...current, [studentId]: status }));
    setSavedMessage("");
  };

  const markAllPresent = () => {
    setStatuses((current) => ({
      ...current,
      ...Object.fromEntries(students.map((student) => [student.studentId, "present"])),
    }));
    setSavedMessage("");
  };

  const saveAttendance = async () => {
    if (!selectedClassId || students.length === 0 || unmarkedCount > 0) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await submitAttendance(
        selectedClassId,
        students.map((student) => ({
          studentId: student.studentId,
          status: statuses[student.studentId] === "present" ? "PRESENT" : "ABSENT",
        })),
      );
      setSavedMessage("Attendance saved successfully.");
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Unable to save attendance. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && schedule.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
          <div className="mt-7 rounded-xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">Loading attendance...</div>
        </div>
      </div>
    );
  }

  if (!isLoading && schedule.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Attendance</h1>
          <div className={`mt-7 rounded-xl border p-5 text-sm ${error ? "border-red-900/80 bg-red-950/40 text-red-300" : "border-gray-800 bg-gray-900 text-gray-400"}`}>
            {error || "No classes are currently assigned to your account."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Attendance</h1>
            <p className="mt-2 text-sm text-gray-400 sm:text-base">Record who attended each class.</p>
          </div>
          <label className="w-full text-sm text-gray-400 sm:max-w-xs">
            Select class
            <select
              value={selectedClassId}
              onChange={(event) => {
                setSelectedClassId(event.target.value);
                setSavedMessage("");
                setError("");
                setIsLoading(true);
                setStudents([]);
                setStatuses({});
              }}
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              {schedule.map((classItem) => (
                <option key={classItem.id ?? `${classItem.subject}-${classItem.startTime}`} value={classItem.id ?? ""}>
                  {dayNames[classItem.dayOfWeek ?? 1]} · {classItem.startTime ?? "09:00"} · {classItem.subject ?? "Class"} ({classItem.groupName ?? "Group"})
                </option>
              ))}
            </select>
          </label>
        </header>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900/80 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>
        ) : null}

        {selectedClass ? (
          <section className="mt-7 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5" aria-label="Selected class">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedClass.subject ?? "Class"}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {dayNames[selectedClass.dayOfWeek ?? 1]} · {selectedClass.startTime ?? "09:00"}–{selectedClass.endTime ?? "10:00"} · Room {selectedClass.roomCode ?? "TBD"} · {selectedClass.groupName ?? "Group"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><Users size={17} /> {students.length} students</div>
            </div>
          </section>
        ) : null}
        {isLoading ? <p role="status" className="mt-4 text-sm text-gray-400">Loading roster and existing attendance...</p> : null}

        <section className="mt-5 grid grid-cols-3 gap-3" aria-label="Attendance summary">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4"><p className="text-xs text-gray-500 sm:text-sm">Present</p><p className="mt-1 text-xl font-semibold text-green-400 sm:text-2xl">{presentCount}</p></div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4"><p className="text-xs text-gray-500 sm:text-sm">Absent</p><p className="mt-1 text-xl font-semibold text-red-400 sm:text-2xl">{absentCount}</p></div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 sm:p-4"><p className="text-xs text-gray-500 sm:text-sm">Not marked</p><p className="mt-1 text-xl font-semibold text-amber-400 sm:text-2xl">{unmarkedCount}</p></div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1 sm:max-w-sm">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <span className="sr-only">Search students</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students" className="w-full rounded-lg border border-gray-700 bg-gray-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500" />
            </label>
            <button type="button" onClick={markAllPresent} disabled={isLoading || students.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"><CheckCheck size={16} /> Mark all present</button>
          </div>

          <div className="divide-y divide-gray-800">
            {visibleStudents.map((student) => {
              const status = statuses[student.studentId] ?? "unmarked";
              return (
                <div key={student.studentId} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-gray-300">
                      {student.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0"><p className="truncate font-medium">{student.fullName}</p><p className="mt-0.5 text-xs text-gray-500">{student.studentNumber}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                    <button type="button" aria-pressed={status === "present"} onClick={() => setStatus(student.studentId, status === "present" ? "unmarked" : "present")} className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${status === "present" ? "border-green-700 bg-green-950/50 text-green-300" : "border-gray-700 text-gray-400 hover:bg-gray-800"}`}><Check size={15} /> Present</button>
                    <button type="button" aria-pressed={status === "absent"} onClick={() => setStatus(student.studentId, status === "absent" ? "unmarked" : "absent")} className={`rounded-lg border px-3 py-2 text-sm transition ${status === "absent" ? "border-red-800 bg-red-950/40 text-red-300" : "border-gray-700 text-gray-400 hover:bg-gray-800"}`}>Absent</button>
                  </div>
                </div>
              );
            })}
            {visibleStudents.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-500">No students match “{query}”.</p>}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-gray-500">{unmarkedCount > 0 ? `${unmarkedCount} student${unmarkedCount === 1 ? "" : "s"} still need a status.` : "Every student has a status."}</p>
            <div className="flex items-center gap-3">
              {savedMessage && <p role="status" className="inline-flex items-center gap-1.5 text-sm text-green-400"><UserRoundCheck size={16} /> {savedMessage}</p>}
              <button type="button" onClick={saveAttendance} disabled={unmarkedCount > 0 || students.length === 0 || isSaving || isLoading || !selectedClassId} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400">
                <Save size={16} /> {isSaving ? "Saving..." : "Save attendance"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherAttendance;
