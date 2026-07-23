import React from "react";
import {
  FiCalendar,
  FiHash,
  FiDollarSign,
} from "react-icons/fi";

import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";

export default function OrderHeader({ order }) {
  if (!order) return null;

  return (
    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow
        border
        dark:border-gray-700
        p-6
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-6
        "
      >
        {/* Left */}
        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              Order Number
            </p>

            <h1
              className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-gray-500
            "
          >
            <FiCalendar />

            <span>
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

        </div>

        {/* Right */}
        <div
          className="
            flex
            flex-col
            gap-5
            lg:items-end
          "
        >
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Order Status
            </p>

            <StatusBadge
              status={order.orderStatus}
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Payment Status
            </p>

            <PaymentBadge
              status={order.paymentStatus}
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <h2
              className="
                text-3xl
                font-bold
                text-green-600
              "
            >
              KSh {order.total.toLocaleString()}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}