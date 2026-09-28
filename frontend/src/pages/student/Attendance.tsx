type AttendanceRecord = {
  subject: string;
  attended: number;
  total: number;
};

const attendanceData: AttendanceRecord[] = [
  {
    subject: "Software Engineering",
    attended: 18,
    total: 20,
  },
  {
    subject: "Database",
    attended: 17,
    total: 20,
  },
  {
    subject: "Web Development",
    attended: 18,
    total: 20,
  },
  {
    subject: "Artificial Intelligence",
    attended: 14,
    total: 20,
  },
];

function calculatePercentage(attended: number, total: number) {
  return Math.round((attended / total) * 100);
}

function StudentAttendance() {
  const totalAttended = attendanceData.reduce(
    (sum, item) => sum + item.attended,
    0,
  );

  const totalClasses = attendanceData.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const overallPercentage = calculatePercentage(
    totalAttended,
    totalClasses,
  );

  const warningSubjects = attendanceData.filter(
    (item) => calculatePercentage(item.attended, item.total) <= 75,
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Attendance
        </h1>

        <p className="mt-2 text-gray-400">
          Monitor your attendance across all subjects.
        </p>

        {/* Overall Attendance */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">
            Overall Attendance
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold">
              {overallPercentage}%
            </span>

            <span className="mb-1 text-gray-500">
              attendance
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${overallPercentage}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {totalAttended} attended out of {totalClasses} classes
          </p>
        </div>

        {/* Warning */}
        {warningSubjects.length > 0 && (
          <div className="mt-6 rounded-2xl border border-yellow-800 bg-yellow-950/40 p-5">
            <h2 className="font-semibold text-yellow-400">
              Attendance Warning
            </h2>

            <p className="mt-2 text-sm text-yellow-200/80">
              You are approaching the attendance limit in{" "}
              {warningSubjects.length} subject
              {warningSubjects.length > 1 ? "s" : ""}.
            </p>
          </div>
        )}

        {/* Subjects */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">
            By Subject
          </h2>

          <div className="mt-5 space-y-4">
            {attendanceData.map((item) => {
              const percentage = calculatePercentage(
                item.attended,
                item.total,
              );

              return (
                <div
                  key={item.subject}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">
                        {item.subject}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.attended} / {item.total} classes attended
                      </p>
                    </div>

                    <span className="text-xl font-bold">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;

