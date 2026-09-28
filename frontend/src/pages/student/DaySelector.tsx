
type Day = "yesterday" | "today" | "tomorrow";

type DaySelectorProps = {
  selectedDay: Day;
  onDayChange: (day: Day) => void;
};

function DaySelector({
  selectedDay,
  onDayChange,
}: DaySelectorProps) {
  const days: Day[] = [
    "yesterday",
    "today",
    "tomorrow",
  ];

  return (
    <div className="flex gap-3">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDayChange(day)}
          className={`rounded-lg px-5 py-3 capitalize transition ${
            selectedDay === day
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

export default DaySelector;
