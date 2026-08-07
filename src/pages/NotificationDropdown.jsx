import React from "react";
import NotificationCard from "./NotificationCard";
import { useMarkAllAsReadMutation } from "../features/notifications/notificationsApiSlice";

const NotificationDropdown = ({
  notifications,
  isLoading,
  isError,
  closeDropdown,
}) => {
  const [markAllAsRead, { isLoading: isMarking }] =
    useMarkAllAsReadMutation();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
        <div className="p-4 text-center">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
        <div className="p-4 text-center text-red-500">
          Failed to load notifications.
        </div>
      </div>
    );
  }

  if (!notifications?.ids?.length) {
    return (
      <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
        <div className="p-4 text-center">
          No notifications.
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">

      {/* Header */}

      <div className="flex items-center justify-between p-4 border-b">

        <h2 className="font-semibold text-lg">
          Notifications
        </h2>

        <button
          onClick={handleMarkAllAsRead}
          disabled={isMarking}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>

      </div>

      {/* Notifications */}

      <div className="max-h-96 overflow-y-auto">

        {notifications.ids.map((id) => (

          <NotificationCard
            key={id}
            notification={notifications.entities[id]}
            closeDropdown={closeDropdown}
          />

        ))}

      </div>

    </div>
  );
};

export default NotificationDropdown;