import React from "react";
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiHome,
  FiXCircle,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";

export default function OrderTimeline({ order }) {
  if (!order) return null;

  const events = [
    {
      title: "Order Created",
      date: order.createdAt,
      icon: <FiPackage />,
      color: "bg-blue-500",
    },

    {
      title: "Order Confirmed",
      date: order.confirmedAt,
      icon: <FiCheckCircle />,
      color: "bg-indigo-500",
    },

    {
      title: "Processing",
      date: order.processingAt,
      icon: <FiPackage />,
      color: "bg-purple-500",
    },

    {
      title: "Shipped",
      date: order.shippedAt,
      icon: <FiTruck />,
      color: "bg-orange-500",
    },

    {
      title: "Delivered",
      date: order.deliveredAt,
      icon: <FiHome />,
      color: "bg-green-600",
    },

    {
      title: "Cancelled",
      date: order.cancelledAt,
      icon: <FiXCircle />,
      color: "bg-red-600",
    },

    {
      title: "Payment Received",
      date: order.paidAt,
      icon: <FiDollarSign />,
      color: "bg-emerald-600",
    },

    {
      title: "Refund Completed",
      date: order.refundedAt,
      icon: <FiRefreshCw />,
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white">
        Order Timeline
      </h2>

      <div className="space-y-6">
        {events
          .filter((event) => event.date)
          .map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div
                className={`
                  ${event.color}
                  text-white
                  rounded-full
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                `}
              >
                {event.icon}
              </div>

              <div className="flex-1">
                <p className="font-semibold dark:text-white">
                  {event.title}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

        {events.filter((event) => event.date).length === 0 && (
          <p className="text-gray-500">
            No timeline events available.
          </p>
        )}
      </div>
    </div>
  );
}