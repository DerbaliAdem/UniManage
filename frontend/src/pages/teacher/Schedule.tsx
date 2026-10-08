import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";

import { getTeacherSchedule } from "../../api/scheduleApi";
import type { TeacherScheduleItem } from "../../types/api";

const weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TeacherSchedule() {
  const [classes, setClasses] = useState<TeacherScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTeacherSchedule();
        setClasses(data);
      } catch {
        setError("Unable to load your schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadSchedule();
  }, []);

  const groupedClasses = useMemo(() => {
    const groups: Record<string, TeacherScheduleItem[]> = {};
    for (const item of classes) {
      const dayName = weekdays[item.dayOfWeek ?? 1] ?? "Monday";
      if (!groups[dayName]) {
        groups[dayName] = [];
      }
      groups[dayName].push(item);
    }
    Object.values(groups).forEach((items) => {
      items.sort((a, b) => (a.startTime ?? "00:00").localeCompare(b.startTime ?? "00:00"));
    });
    return groups;
  }, [classes]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">My schedule</h1>
        <p className="mt-2 text-gray-400">Weekly classes, assigned groups, and rooms.</p>

        {loading ? (
          <div className="mt-7 rounded-xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">Loading schedule...</div>
        ) : error ? (
          <div className="mt-7 rounded-xl border border-red-900/80 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>
        ) : (
          <div className="mt-7 space-y-6">
            {weekdays.slice(1).map((day) => {
              const dayClasses = groupedClasses[day] ?? [];
              return (
                <section key={day} className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                  <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3 sm:px-5">
                    <CalendarDays size={16} className="text-gray-500" />
                    <h2 className="font-semibold">{day}</h2>
                    <span className="ml-auto text-xs text-gray-500">
                      {dayClasses.length} {dayClasses.length === 1 ? "class" : "classes"}
                    </span>
                  </div>

                  {dayClasses.length ? (
                    <div className="divide-y divide-gray-800">
                      {dayClasses.map((classItem) => (
                        <article key={classItem.id ?? `${classItem.subject}-${classItem.startTime}`} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                          <div className="w-28 shrink-0 text-sm font-medium tabular-nums text-gray-300">
                            {classItem.startTime ?? "09:00"}
                            <span className="text-gray-600"> – </span>
                            {classItem.endTime ?? "10:00"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium">{classItem.subject ?? "Course"}</h3>
                            <p className="mt-1 text-sm text-gray-500">{classItem.groupName ?? "Group"}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                            <MapPin size={15} /> Room {classItem.roomCode ?? "TBD"}
                          </span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="px-5 py-5 text-sm text-gray-500">No classes scheduled.</p>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherSchedule;
