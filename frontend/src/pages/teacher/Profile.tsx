import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../api/client";
import { getCurrentUserProfile, updateCurrentUserProfile } from "../../api/teacherApi";
import type { TeacherProfile as TeacherProfileType } from "../../types/api";

const emptyProfile: TeacherProfileType = {
  id: "",
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "TEACHER",
  active: true,
};

function TeacherProfile() {
  const [profile, setProfile] = useState<TeacherProfileType>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getCurrentUserProfile();
        setProfile({ ...emptyProfile, ...data });
      } catch {
        setStatus({ type: "error", text: "Unable to load your profile." });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      const updated = await updateCurrentUserProfile({
        fullName: profile.fullName,
        department: profile.department ?? undefined,
      });
      setProfile((current) => ({ ...current, ...updated }));
      setStatus({ type: "success", text: "Profile updated successfully." });
    } catch (errorValue) {
      setStatus({ type: "error", text: getApiErrorMessage(errorValue, "Unable to save profile. Please try again.") });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
          <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-blue-400">TEACHER PORTAL</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Profile</h1>
        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-lg font-semibold text-blue-300">
              {profile.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("") || "T"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              <p className="text-sm text-gray-400">{profile.role || "Teacher"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-gray-300 sm:col-span-2">Full name<input value={profile.fullName} onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value, firstName: event.target.value.split(/\s+/)[0] ?? "", lastName: event.target.value.split(/\s+/).slice(1).join(" ") }))} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label>
            <label className="text-sm text-gray-300 sm:col-span-2">Email<input value={profile.email} readOnly className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-gray-500 outline-none" /></label>
            <label className="text-sm text-gray-300">Department<input value={profile.department ?? ""} onChange={(event) => setProfile((current) => ({ ...current, department: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label>
            <label className="text-sm text-gray-300">Staff ID<input value={profile.staffNumber ?? ""} readOnly className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-gray-500 outline-none" /></label>
          </div>

          {status && (
            <p className={`mt-4 text-sm ${status.type === "success" ? "text-green-400" : "text-red-300"}`}>{status.text}</p>
          )}

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={handleSave} disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700">
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
