import ClassCard from "./ClassCard";
import { weeklySchedule } from "../../services/mockSchedule";
import type { WeekDay } from "../../types/schedule";

const days: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Timetable() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">
          My Timetable
        </h1>

        <p className="mt-2 text-gray-400">
          Your complete weekly university schedule.
        </p>

        <div className="mt-8 space-y-10">
          {days.map((day) => (
            <section key={day}>
              <h2 className="text-2xl font-semibold">
                {day}
              </h2>

              <div className="mt-4 space-y-4">
                {weeklySchedule[day].map((classItem) => (
                  <ClassCard
                    key={`${day}-${classItem.subject}-${classItem.startTime}`}
                    classItem={classItem}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timetable;

