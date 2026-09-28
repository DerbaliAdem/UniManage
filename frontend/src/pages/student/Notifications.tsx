import { useState } from "react";

type NotificationType = "warning" | "info" | "success";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Attendance Alert",
    message:
      "Your attendance in Artificial Intelligence is approaching the allowed limit.",
    type: "warning",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Schedule Update",
    message:
      "Tomorrow's Software Engineering class has been moved to room A202.",
    type: "info",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Room Information",
    message:
      "Room A101 is currently available for your next class.",
    type: "success",
    time: "Yesterday",
    read: true,
  },
];

function StudentNotifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications,
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const getNotificationStyle = (
    type: NotificationType,
  ) => {
    switch (type) {
      case "warning":
        return "border-yellow-800 bg-yellow-950/30";

      case "success":
        return "border-green-800 bg-green-950/30";

      case "info":
        return "border-blue-800 bg-blue-950/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-2 text-gray-400">
              Important updates about your university life.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="mt-8 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-5 transition ${getNotificationStyle(
                notification.type,
              )} ${
                notification.read
                  ? "opacity-70"
                  : "opacity-100"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">
                      {notification.title}
                    </h2>

                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-300">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {notification.time}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    className="self-start rounded-lg px-3 py-2 text-sm text-blue-400 transition hover:bg-gray-800 hover:text-blue-300"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-500">
              You have no notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentNotifications;

