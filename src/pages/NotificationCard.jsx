
import React from "react";
import {
  AlertTriangle,
  Clock3,
  Package,
} from "lucide-react";


import { formatDistanceToNow } from "date-fns";

import { useMarkAsReadMutation } from "../features/notifications/notificationsApiSlice";
const NotificationCard = ({
  notification,
  closeDropdown,
}) => {

  const [markAsRead] =
    useMarkAsReadMutation();

  const notificationTypes = {

    LOW_STOCK: {
      icon: Package,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },

    EXPIRING_SOON: {
      icon: Clock3,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },

    EXPIRED: {
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },

  };

  const config =
    notificationTypes[
      notification.type
    ] || {
      icon: AlertTriangle,
      iconColor: "text-gray-500",
      bgColor: "bg-gray-50",
    };

  const Icon = config.icon;

  const handleClick = async () => {

    try {

      if (!notification.read) {

        await markAsRead(
          notification._id
        ).unwrap();

      }

      closeDropdown();

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <button

      onClick={handleClick}

      className={`
        w-full
        text-left
        p-4
        border-b
        transition
        hover:bg-gray-50

        ${
          !notification.read
            ? "bg-blue-50"
            : "bg-white"
        }
      `}

    >

      <div className="flex gap-3">

        {/* Icon */}

        <div
          className={`
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center

            ${config.bgColor}
          `}
        >

          <Icon
            size={20}
            className={config.iconColor}
          />

        </div>

        {/* Content */}

        <div className="flex-1">

          <div className="flex justify-between items-start">

            <h3
              className={`
                font-semibold

                ${
                  notification.read
                    ? "text-gray-700"
                    : "text-gray-900"
                }
              `}
            >

              {notification.title}

            </h3>

            <span
              className="
                text-xs
                text-gray-500
                whitespace-nowrap
                ml-3
              "
            >

              {formatDistanceToNow(
                new Date(notification.createdAt),
                {
                  addSuffix: true,
                }
              )}

            </span>

          </div>

          <p
            className="
              mt-1
              text-sm
              text-gray-600
            "
          >

            {notification.message}

          </p>

        </div>

      </div>

    </button>

  );

};

export default NotificationCard;