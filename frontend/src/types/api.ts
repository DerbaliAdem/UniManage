export type UserRole = "TEACHER" | "STUDENT" | "ADMIN";

export type AttendanceStatusValue = "PRESENT" | "ABSENT";
export type SeverityValue = "LOW" | "MEDIUM" | "HIGH";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: AuthUser;
}

export interface ApiError {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  status?: number;
}

export interface TeacherScheduleItem {
  id?: string;
  courseCode?: string;
  subject?: string;
  teacherName?: string;
  teacherId?: string;
  groupName?: string;
  roomId?: string;
  roomCode?: string;
  roomStatus?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

export interface TeacherDashboardData {
  teacherId?: string;
  department?: string;
  todayClasses: TeacherScheduleItem[];
  upcomingClasses: TeacherScheduleItem[];
  totalClassesToday: number;
  nextClass?: TeacherScheduleItem | null;
}

export interface ClassStudent {
  studentId: string;
  fullName: string;
  studentNumber: string;
  groupName: string;
}

export interface AttendanceItem {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  groupName: string;
  status: AttendanceStatusValue;
  classSessionId?: string;
  classDate?: string;
  courseCode?: string;
  courseName?: string;
}

export interface BehaviorReport {
  id: string;
  studentId: string;
  studentName: string;
  reportType: string;
  severity: SeverityValue;
  description: string;
  status: string;
  className: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  studentNumber?: string | null;
  groupName?: string | null;
  staffNumber?: string | null;
  department?: string | null;
  phone?: string | null;
}

export interface TeacherProfile {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string | null;
  department?: string | null;
  staffNumber?: string | null;
  active?: boolean;
}
