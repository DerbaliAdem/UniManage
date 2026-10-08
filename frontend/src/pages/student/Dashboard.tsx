import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import DaySelector from "./DaySelector";
import { dayNames, getClassesForDay, getRelativeDay } from "../../services/mockSchedule";
import type { Day, WeekDay } from "../../types/schedule";

function getCurrentWeekDay(): WeekDay | null {
  const jsDay = new Date().getDay();
  if (jsDay === 0) return null;
  return dayNames[jsDay - 1] ?? null;
}

function getClassStatus(startTime: string, endTime: string, selectedDay: Day): "completed" | "current" | "upcoming" {
  if (selectedDay === "yesterday") return "completed";
  if (selectedDay === "tomorrow") return "upcoming";
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  if (currentMinutes >= end) return "completed";
  if (currentMinutes >= start) return "current";
  return "upcoming";
}

function StudentDashboard() {
  const [selectedDay, setSelectedDay] = useState<Day>("today");
  const currentWeekDay = getCurrentWeekDay();
  const selectedWeekDay = currentWeekDay ? getRelativeDay(selectedDay, currentWeekDay) : null;
  const todayClasses = currentWeekDay ? getClassesForDay(currentWeekDay) : [];
  const displayedClasses = selectedWeekDay ? getClassesForDay(selectedWeekDay) : [];
  const currentClass = selectedDay === "today" ? todayClasses.find((item) => getClassStatus(item.startTime, item.endTime, "today") === "current") : undefined;
  const dayLabel = selectedWeekDay ?? (selectedDay === "yesterday" ? "Sunday" : selectedDay === "tomorrow" ? "Sunday" : "Today");

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-blue-400">STUDENT PORTAL</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your classes</h1>
      <p className="mt-2 text-gray-400">See what you have today and plan the next few days.</p>

      <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm text-gray-400"><CalendarDays size={16} /><span>{selectedDay === "today" ? "TODAY" : selectedDay.toUpperCase()} · {dayLabel}</span></div><p className="mt-2 text-2xl font-semibold">{displayedClasses.length} {displayedClasses.length === 1 ? "class" : "classes"}</p></div><DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} /></div>
      </section>

      {selectedWeekDay ? <section className="mt-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{selectedDay === "today" ? "Today’s timetable" : `${selectedWeekDay} timetable`}</h2><Link to="/student/timetable" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">Full timetable <ArrowRight size={15} /></Link></div>
        {displayedClasses.length ? <div className="space-y-3">{displayedClasses.map((classItem) => { const status = getClassStatus(classItem.startTime, classItem.endTime, selectedDay); return <article key={`${selectedWeekDay}-${classItem.subject}-${classItem.startTime}`} className={`rounded-xl border bg-gray-900 p-4 sm:p-5 ${status === "current" ? "border-blue-700/70" : "border-gray-800"}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex w-full items-center gap-2 text-sm tabular-nums text-gray-300 sm:w-32 sm:shrink-0 sm:items-start sm:gap-1"><Clock3 size={16} className="text-gray-500 sm:mt-0.5" /><span>{classItem.startTime}–{classItem.endTime}</span></div><div className="min-w-0 flex-1"><h3 className="font-semibold">{classItem.subject}</h3><p className="mt-1 text-sm text-gray-500">{classItem.teacher}</p></div><div className="flex items-center justify-between gap-4 sm:justify-end"><span className="inline-flex items-center gap-1.5 text-sm text-gray-400"><MapPin size={15} /> Room {classItem.room}</span><span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status === "current" ? "bg-green-950/60 text-green-300" : status === "completed" ? "bg-gray-800 text-gray-400" : "bg-blue-950/50 text-blue-300"}`}>{status}</span></div></div></article>; })}</div> : <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-10 text-center"><BookOpen size={24} className="mx-auto text-gray-600" /><h3 className="mt-3 font-medium">No classes scheduled</h3><p className="mt-1 text-sm text-gray-500">Enjoy the open time in your timetable.</p></div>}
      </section> : <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5"><h2 className="font-semibold">No timetable data for {dayLabel}</h2><p className="mt-1 text-sm text-gray-500">Your timetable currently includes classes Monday through Saturday.</p><Link to="/student/timetable" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400">View full timetable <ArrowRight size={15} /></Link></section>}

      {currentClass && <p className="mt-5 text-sm text-gray-500">You’re in <span className="text-gray-300">{currentClass.subject}</span> now · Room {currentClass.room}.</p>}
      <p className="mt-6 text-xs text-gray-600">Timetable data is a prototype. Contact your department if your schedule appears incorrect.</p>
    </div></div>
  );
}

export default StudentDashboard;
