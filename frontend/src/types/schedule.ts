export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type Day = "yesterday" | "today" | "tomorrow";

export type ClassItem = {
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  teacher: string;
};

export type WeeklySchedule = Record<WeekDay, ClassItem[]>;

