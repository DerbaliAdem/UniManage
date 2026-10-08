import apiClient from "./client";

import type {
  AttendanceItem,
  BehaviorReport,
  ClassStudent,
  TeacherDashboardData,
  TeacherProfile,
  TeacherScheduleItem,
  UserProfile,
} from "../types/api";

const normalizeScheduleItem = (item: Partial<TeacherScheduleItem>): TeacherScheduleItem => ({
  id: item.id ?? undefined,
  courseCode: item.courseCode ?? undefined,
  subject: item.subject ?? item.courseCode ?? "Class",
  teacherName: item.teacherName ?? "Teacher",
  teacherId: item.teacherId ?? undefined,
  groupName: item.groupName ?? "",
  roomId: item.roomId ?? undefined,
  roomCode: item.roomCode ?? "",
  roomStatus: item.roomStatus ?? "AVAILABLE",
  dayOfWeek: item.dayOfWeek ?? 1,
  startTime: item.startTime ?? "09:00",
  endTime: item.endTime ?? "10:00",
});

const normalizeClassStudent = (item: Partial<ClassStudent>): ClassStudent => ({
  studentId: item.studentId ?? "",
  fullName: item.fullName ?? "Student",
  studentNumber: item.studentNumber ?? "",
  groupName: item.groupName ?? "",
});

const normalizeAttendanceItem = (item: Partial<AttendanceItem>): AttendanceItem => ({
  id: item.id ?? "",
  studentId: item.studentId ?? "",
  studentName: item.studentName ?? "Student",
  studentNumber: item.studentNumber ?? "",
  groupName: item.groupName ?? "",
  status: (item.status ?? "ABSENT") as AttendanceItem["status"],
  classSessionId: item.classSessionId,
  classDate: item.classDate,
  courseCode: item.courseCode,
  courseName: item.courseName,
});

const normalizeUserProfile = (item: Partial<UserProfile>): UserProfile => ({
  id: item.id ?? "",
  email: item.email ?? "",
  fullName: item.fullName ?? "",
  role: (item.role ?? "TEACHER") as UserProfile["role"],
  studentNumber: item.studentNumber ?? null,
  groupName: item.groupName ?? null,
  staffNumber: item.staffNumber ?? null,
  department: item.department ?? null,
});

const normalizeTeacherProfile = (item: Partial<TeacherProfile>): TeacherProfile => {
  const fullName = item.fullName ?? item.email ?? "Teacher";
  const [firstName = "", ...lastNameParts] = fullName.split(" ");
  const lastName = lastNameParts.join(" ");

  return {
    id: item.id ?? "",
    email: item.email ?? "",
    fullName,
    firstName: item.firstName ?? firstName,
    lastName: item.lastName ?? lastName,
    role: (item.role ?? "TEACHER") as TeacherProfile["role"],
    phone: item.phone ?? null,
    department: item.department ?? null,
    staffNumber: item.staffNumber ?? null,
    active: item.active ?? true,
  };
};

const normalizeBehaviorReport = (item: Partial<BehaviorReport>): BehaviorReport => ({
  id: item.id ?? "",
  studentId: item.studentId ?? "",
  studentName: item.studentName ?? "Student",
  reportType: item.reportType ?? "General concern",
  severity: (item.severity ?? "MEDIUM") as BehaviorReport["severity"],
  description: item.description ?? "",
  status: item.status ?? "NEEDS_REVIEW",
  className: item.className ?? "General class",
});

export const getTeacherDashboard = async (): Promise<TeacherDashboardData> => {
  const { data } = await apiClient.get("/teachers/me/dashboard");
  return {
    teacherId: data.teacherId,
    department: data.department,
    todayClasses: Array.isArray(data.todayClasses) ? data.todayClasses.map(normalizeScheduleItem) : [],
    upcomingClasses: Array.isArray(data.upcomingClasses) ? data.upcomingClasses.map(normalizeScheduleItem) : [],
    totalClassesToday: Number(data.totalClassesToday ?? 0),
    nextClass: data.nextClass ? normalizeScheduleItem(data.nextClass) : null,
  };
};

export const getTeacherSchedule = async (): Promise<TeacherScheduleItem[]> => {
  const { data } = await apiClient.get("/teachers/me/schedule");
  return Array.isArray(data) ? data.map(normalizeScheduleItem) : [];
};

export const getTeacherRoster = async (): Promise<ClassStudent[]> => {
  const { data } = await apiClient.get("/teachers/me/roster");
  return Array.isArray(data) ? data.map(normalizeClassStudent) : [];
};

export const getClassStudents = async (sessionId: string): Promise<ClassStudent[]> => {
  const { data } = await apiClient.get(`/classes/${sessionId}/students`);
  return Array.isArray(data) ? data.map(normalizeClassStudent) : [];
};

export const getAttendanceForSession = async (sessionId: string): Promise<AttendanceItem[]> => {
  const { data } = await apiClient.get(`/attendance/session/${sessionId}`);
  return Array.isArray(data) ? data.map(normalizeAttendanceItem) : [];
};

export const submitAttendance = async (sessionId: string, records: { studentId: string; status: "PRESENT" | "ABSENT" }[]) => {
  const { data } = await apiClient.post(`/attendance/session/${sessionId}`, { records });
  return Array.isArray(data) ? data.map(normalizeAttendanceItem) : [];
};

export const getCurrentUserProfile = async (): Promise<TeacherProfile> => {
  const { data } = await apiClient.get("/users/me");
  return normalizeTeacherProfile(data);
};

export const updateCurrentUserProfile = async (payload: { fullName?: string; department?: string }) => {
  const { data } = await apiClient.put("/users/me", payload);
  return normalizeTeacherProfile(data);
};

export const getTeacherProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get("/users/me");
  return normalizeUserProfile(data);
};

export const updateTeacherProfile = async (payload: { fullName?: string; phone?: string; department?: string }) => {
  const { data } = await apiClient.put("/users/me", payload);
  return normalizeUserProfile(data);
};

export const submitBehaviorReport = async (payload: {
  studentId: string;
  classSessionId: string;
  reportType: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
}) => {
  const { data } = await apiClient.post("/behavior-reports", payload);
  return normalizeBehaviorReport(data);
};

export const getBehaviorReports = async (): Promise<BehaviorReport[]> => {
  const { data } = await apiClient.get("/behavior-reports/my");
  return Array.isArray(data) ? data.map(normalizeBehaviorReport) : [];
};
