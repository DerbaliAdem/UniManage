export type TeacherClass = {
  id: string;
  subject: string;
  group: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
};

export type AttendanceStatus = "present" | "absent" | "unmarked";

export type TeacherStudent = {
  id: string;
  name: string;
  studentNumber: string;
};

export const teacherClasses: TeacherClass[] = [
  { id: "web-mon", subject: "Web Development", group: "GLSI L3", room: "A103", startTime: "10:00", endTime: "12:00", day: "Monday" },
  { id: "db-mon", subject: "Database Systems", group: "GLSI L2", room: "B204", startTime: "14:00", endTime: "16:00", day: "Monday" },
  { id: "web-tue", subject: "Web Development", group: "GLSI L3", room: "A103", startTime: "08:00", endTime: "10:00", day: "Tuesday" },
  { id: "net-tue", subject: "Networks", group: "GLSI L2", room: "A201", startTime: "10:00", endTime: "12:00", day: "Tuesday" },
  { id: "db-wed", subject: "Database Systems", group: "GLSI L3", room: "B204", startTime: "14:00", endTime: "16:00", day: "Wednesday" },
];

export const classStudents: TeacherStudent[] = [
  { id: "s-001", name: "Adam Derbali", studentNumber: "STU-001" },
  { id: "s-002", name: "Amira Ben Salem", studentNumber: "STU-002" },
  { id: "s-003", name: "Youssef Trabelsi", studentNumber: "STU-003" },
  { id: "s-004", name: "Mariam Gharbi", studentNumber: "STU-004" },
  { id: "s-005", name: "Sami Khelifi", studentNumber: "STU-005" },
  { id: "s-006", name: "Ines Mansour", studentNumber: "STU-006" },
  { id: "s-007", name: "Omar Jaziri", studentNumber: "STU-007" },
  { id: "s-008", name: "Lina Saidi", studentNumber: "STU-008" },
];
