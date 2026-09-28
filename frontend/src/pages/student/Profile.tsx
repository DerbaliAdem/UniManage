function StudentProfile() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-gray-400">
          View and manage your personal information.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold">
              AD
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                Adam Derbali
              </h2>

              <p className="mt-1 text-gray-400">
                Student
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm text-gray-400">
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Adam Derbali"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                defaultValue="student@example.com"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Student ID
              </label>

              <input
                type="text"
                defaultValue="STU-001"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">
                Class / Group
              </label>

              <input
                type="text"
                defaultValue="GLSI - L3"
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;

