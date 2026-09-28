import type {
  Day,
  WeekDay,
  WeeklySchedule,
  ClassItem,
} from "../types/schedule";

export const weeklySchedule: WeeklySchedule = {
  Monday: [
    {
      subject: "Software Engineering",
      startTime: "08:00",
      endTime: "10:00",
      room: "A101",
      teacher: "Mr. Ahmed",
    },
    {
      subject: "Database",
      startTime: "10:00",
      endTime: "12:00",
      room: "B204",
      teacher: "Mrs. Sara",
    },
    {
      subject: "Web Development",
      startTime: "14:00",
      endTime: "16:00",
      room: "A103",
      teacher: "Mr. Karim",
    },
  ],

  Tuesday: [
    {
      subject: "Networks",
      startTime: "08:00",
      endTime: "10:00",
      room: "A201",
      teacher: "Mr. Nabil",
    },
    {
      subject: "Artificial Intelligence",
      startTime: "10:00",
      endTime: "12:00",
      room: "C201",
      teacher: "Dr. Sami",
    },
  ],

  Wednesday: [
    {
      subject: "Software Architecture",
      startTime: "08:00",
      endTime: "10:00",
      room: "A202",
      teacher: "Mr. Ahmed",
    },
    {
      subject: "Database",
      startTime: "14:00",
      endTime: "16:00",
      room: "B204",
      teacher: "Mrs. Sara",
    },
  ],

  Thursday: [
    {
      subject: "Web Development",
      startTime: "08:00",
      endTime: "10:00",
      room: "A103",
      teacher: "Mr. Karim",
    },
    {
      subject: "Networks",
      startTime: "10:00",
      endTime: "12:00",
      room: "A201",
      teacher: "Mr. Nabil",
    },
  ],

  Friday: [
    {
      subject: "Artificial Intelligence",
      startTime: "08:00",
      endTime: "10:00",
      room: "C201",
      teacher: "Dr. Sami",
    },
    {
      subject: "Software Engineering",
      startTime: "10:00",
      endTime: "12:00",
      room: "A101",
      teacher: "Mr. Ahmed",
    },
  ],

  Saturday: [
    {
      subject: "Software Architecture",
      startTime: "08:00",
      endTime: "10:00",
      room: "A202",
      teacher: "Mr. Ahmed",
    },
  ],
};

export const dayNames: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getClassesForDay(day: WeekDay): ClassItem[] {
  return weeklySchedule[day];
}

export function getRelativeDay(
  selectedDay: Day,
  today: WeekDay,
): WeekDay | null {
  const todayIndex = dayNames.indexOf(today);

  if (todayIndex === -1) {
    return null;
  }

  if (selectedDay === "today") {
    return today;
  }

  if (selectedDay === "yesterday") {
    if (todayIndex === 0) {
      return null;
    }

    return dayNames[todayIndex - 1];
  }

  if (todayIndex === dayNames.length - 1) {
    return null;
  }

  return dayNames[todayIndex + 1];
}

