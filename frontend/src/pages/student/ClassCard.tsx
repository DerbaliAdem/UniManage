
import type { ClassItem } from "../../types/schedule";

type ClassCardProps = {
  classItem: ClassItem;
};

function ClassCard({ classItem }: ClassCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h3 className="text-xl font-semibold">
            {classItem.subject}
          </h3>

          <p className="mt-2 text-gray-400">
            {classItem.teacher}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-medium">
            {classItem.startTime} - {classItem.endTime}
          </p>

          <p className="mt-2 text-gray-400">
            Room {classItem.room}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;

