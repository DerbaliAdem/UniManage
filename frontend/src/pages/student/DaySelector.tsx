import type { Day } from "../../types/schedule";

type DaySelectorProps = {
  selectedDay: Day;
  onDayChange: (day: Day) => void;
};

const days: Day[] = ["yesterday", "today", "tomorrow"];

function DaySelector({ selectedDay, onDayChange }: DaySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-gray-800 bg-gray-950 p-1" role="group" aria-label="Choose timetable day">
      {days.map((day) => <button key={day} type="button" aria-pressed={selectedDay === day} onClick={() => onDayChange(day)} className={`rounded-md px-3 py-2 text-sm capitalize transition sm:px-4 ${selectedDay === day ? "bg-gray-800 font-medium text-white" : "text-gray-400 hover:text-white"}`}>{day}</button>)}
    </div>
  );
}

export default DaySelector;
