type StudentClass = {
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  group: string;
  status: "upcoming" | "current" | "completed";
};

const todayClasses: StudentClass[] = [
  {
    subject: "Software Engineering",
    startTime: "08:00",
    endTime: "10:00",
    room: "A101",
    group: "GLSI - L3",
    status: "completed",
  },
  {
    subject: "Web Development",
    startTime: "10:00",
    endTime: "12:00",
    room: "A103",
    group: "GLSI - L3",
    status: "current",
  },
  {
    subject: "Software Architecture",
    startTime: "14:00",
    endTime: "16:00",
    room: "A202",
    group: "GLSI - L2",
    status: "upcoming",
  },
];

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Student Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Keep track of your classes and attendance.
          </p>
        </div>

        {/* Today's summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Today's Classes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {todayClasses.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Current Class
            </p>

            <p className="mt-2 text-lg font-semibold">
              Web Development
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-sm text-gray-500">
              Current Room
            </p>

            <p className="mt-2 text-lg font-semibold">
              A103
            </p>
          </div>
        </div>

        {/* Today's classes */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Today's Classes
          </h2>

          <div className="mt-5 space-y-4">
            {todayClasses.map((classItem) => (
              <div
                key={`${classItem.subject}-${classItem.startTime}`}
                className="rounded-xl border border-gray-800 bg-gray-900 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {classItem.subject}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {classItem.group}
                    </p>
                  </div>

                  <div className="text-sm text-gray-400">
                    {classItem.startTime} -{" "}
                    {classItem.endTime}
                  </div>

                  <div className="text-sm text-gray-400">
                    Room {classItem.room}
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        classItem.status === "completed"
                          ? "bg-gray-800 text-gray-400"
                          : classItem.status === "current"
                            ? "bg-green-950 text-green-400"
                            : "bg-blue-950 text-blue-400"
                      }`}
                    >
                      {classItem.status}
                    </span>
                  </div>
                </div>

                {classItem.status === "current" && (
                  <div className="mt-5 border-t border-gray-800 pt-5">
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
                    >
                      Manage Attendance
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;

