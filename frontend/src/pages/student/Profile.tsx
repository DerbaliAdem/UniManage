import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, UserRound } from "lucide-react";

function StudentProfile() {
  const [fullName, setFullName] = useState("Adam Derbali");
  const [email, setEmail] = useState("student@example.com");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saved, setSaved] = useState(false);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.setCustomValidity("Choose an image file.");
      event.target.reportValidity();
      event.target.setCustomValidity("");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      event.target.setCustomValidity("Choose an image smaller than 2 MB.");
      event.target.reportValidity();
      event.target.setCustomValidity("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    if (newPassword && newPassword.length < 8) {
      setPasswordError("Use at least 8 characters for a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The new password and confirmation do not match.");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl">
      <p className="text-sm font-medium text-blue-400">STUDENT PORTAL</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">My profile</h1><p className="mt-2 text-gray-400">Manage your contact details and profile photo.</p>
      <form onSubmit={handleSubmit} className="mt-7 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
        <div className="flex flex-col gap-5 border-b border-gray-800 pb-6 sm:flex-row sm:items-center">
          {photo ? <img src={photo} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 text-xl font-semibold text-gray-200">AD</div>}
          <div><h2 className="font-semibold">Adam Derbali</h2><p className="mt-1 text-sm text-gray-500">Student · STU-001</p><label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"><UserRound size={15} /> Choose profile photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className="sr-only" /></label><p className="mt-1 text-xs text-gray-600">PNG, JPEG, or WebP · up to 2 MB</p></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-gray-300">Full name<input required value={fullName} onChange={(event) => { setFullName(event.target.value); setSaved(false); }} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-gray-300">Email<input required type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label>
          <label className="text-sm text-gray-300">Phone<input type="tel" autoComplete="tel" value={phone} onChange={(event) => { setPhone(event.target.value); setSaved(false); }} placeholder="Add a phone number" className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none placeholder:text-gray-600 focus:border-blue-500" /></label>
          <label className="text-sm text-gray-300">Student ID<input readOnly value="STU-001" className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-gray-500" /></label>
          <label className="text-sm text-gray-300">Class / group<input readOnly value="GLSI L3" className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-gray-500" /></label>
        </div>
        <section className="mt-7 border-t border-gray-800 pt-5"><h2 className="font-semibold">Change password</h2><p className="mt-1 text-sm text-gray-500">Leave both fields empty to keep your current password.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-gray-300">New password<input type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => { setNewPassword(event.target.value); setSaved(false); }} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label><label className="text-sm text-gray-300">Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setSaved(false); }} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label></div>{passwordError && <p role="alert" className="mt-3 text-sm text-red-300">{passwordError}</p>}</section>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:items-center sm:justify-between">{saved ? <p role="status" className="inline-flex items-center gap-2 text-sm text-green-400"><CheckCircle2 size={16} /> Profile updated in this demo.</p> : <p className="text-xs text-gray-600">Your changes are held in this page only; no account service is connected.</p>}<button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save changes</button></div>
      </form>
    </div></div>
  );
}

export default StudentProfile;
