export type RoomStatus = "Available" | "Occupied" | "Offline" | "Maintenance";

export type AdminRoom = {
  id: string;
  status: RoomStatus;
  capacity: number;
  currentClass?: string;
  teacher?: string;
  group?: string;
  time?: string;
};

export const initialRooms: AdminRoom[] = [
  { id: "A101", status: "Occupied", capacity: 32, currentClass: "Software Engineering", teacher: "Mr. Ahmed", group: "GLSI L3", time: "08:00–10:00" },
  { id: "A102", status: "Available", capacity: 24 },
  { id: "A103", status: "Offline", capacity: 36 },
  { id: "B201", status: "Available", capacity: 40 },
  { id: "B204", status: "Occupied", capacity: 30, currentClass: "Database Systems", teacher: "Mrs. Sara", group: "GLSI L2", time: "10:00–12:00" },
  { id: "C201", status: "Maintenance", capacity: 28 },
];

export const adminStudents = [
  { id: "STU-001", name: "Adam Derbali", group: "GLSI L3", email: "adam.derbali@example.edu", attendance: 88, status: "Active" },
  { id: "STU-002", name: "Amira Ben Salem", group: "GLSI L3", email: "amira.bensalem@example.edu", attendance: 94, status: "Active" },
  { id: "STU-003", name: "Youssef Trabelsi", group: "GLSI L2", email: "youssef.trabelsi@example.edu", attendance: 78, status: "Active" },
  { id: "STU-004", name: "Mariam Gharbi", group: "GLSI L2", email: "mariam.gharbi@example.edu", attendance: 68, status: "Review" },
  { id: "STU-005", name: "Sami Khelifi", group: "GLSI L3", email: "sami.khelifi@example.edu", attendance: 91, status: "Active" },
];

export const behaviorReports = [
  { id: "BR-204", student: "Mariam Gharbi", type: "Repeated lateness", severity: "Medium", teacher: "Mr. Ahmed", date: "Oct 7, 2026", status: "Needs review" },
  { id: "BR-203", student: "Youssef Trabelsi", type: "Disruptive behavior", severity: "High", teacher: "Mrs. Sara", date: "Oct 6, 2026", status: "Needs review" },
  { id: "BR-202", student: "Sami Khelifi", type: "Other", severity: "Low", teacher: "Dr. Sami", date: "Oct 3, 2026", status: "Reviewed" },
];
