import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { getStoredToken, getStoredUser } from "./api/client";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";

import StudentDashboard from "./pages/student/Dashboard";
import Attendance from "./pages/student/Attendance";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";
import Timetable from "./pages/student/Timetable";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherSchedule from "./pages/teacher/Schedule";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherReports from "./pages/teacher/Reports";
import TeacherProfile from "./pages/teacher/Profile";
import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminStudents from "./pages/admin/Students";
import AdminSchedules from "./pages/admin/Schedules";
import AdminReports from "./pages/admin/Reports";
import AdminAlerts from "./pages/admin/Alerts";
import type { UserRole } from "./types/api";

function RequireRoleAuth({ children, role }: { children: React.ReactNode; role: UserRole }) {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const user = getStoredUser();
  const defaultPath = getStoredToken()
    ? user?.role === "TEACHER"
      ? "/teacher"
      : user?.role === "ADMIN"
        ? "/admin"
        : user?.role === "STUDENT"
          ? "/student"
          : "/login"
    : "/login";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={defaultPath} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<RequireRoleAuth role="STUDENT"><StudentLayout /></RequireRoleAuth>}>
          <Route index element={<StudentDashboard />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/teacher" element={<RequireRoleAuth role="TEACHER"><TeacherLayout /></RequireRoleAuth>}>
          <Route index element={<TeacherDashboard />} />
          <Route path="schedule" element={<TeacherSchedule />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="reports" element={<TeacherReports />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>
        <Route path="/admin" element={<RequireRoleAuth role="ADMIN"><AdminLayout /></RequireRoleAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="alerts" element={<AdminAlerts />} />
        </Route>
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
