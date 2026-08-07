import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { Bell } from "lucide-react";

import {
  useGetNotificationsQuery,
} from "../features/notifications/notificationsApiSlice";

import NotificationDropdown from "./NotificationDropDown";

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const unreadCount =
    notifications?.ids?.filter(
      (id) => !notifications.entities[id].read
    ).length || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={24} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-5
              h-5
              px-1
              rounded-full
              bg-red-600
              text-white
              text-xs
              flex
              items-center
              justify-center
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          isError={isError}
          closeDropdown={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationsBell;