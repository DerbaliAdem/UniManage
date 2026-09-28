import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import StudentLayout from "./layouts/StudentLayout";

import StudentDashboard from "./pages/student/Dashboard";
import Attendance from "./pages/student/Attendance";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";
import Timetable from "./pages/student/Timetable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

