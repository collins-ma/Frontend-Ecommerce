import React from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function CustomerCard({ order }) {
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
      <h2
        className="
          text-xl
          font-bold
          mb-6
          text-gray-900
          dark:text-white
        "
      >
        Customer Information
      </h2>

      <div className="space-y-5">

        {/* Username */}
        <div className="flex gap-4">
          <FiUser
            className="
              text-green-600
              text-xl
              mt-1
            "
          />

          <div>
            <p className="text-sm text-gray-500">
              Username
            </p>

            <p className="font-semibold dark:text-white">
              {order.user?.username || "N/A"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex gap-4">
          <FiMail
            className="
              text-green-600
              text-xl
              mt-1
            "
          />

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold dark:text-white break-all">
              {order.user?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-4">
          <FiPhone
            className="
              text-green-600
              text-xl
              mt-1
            "
          />

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-semibold dark:text-white">
              {order.user?.phoneNumber ||
                order.shippingAddress?.phone ||
                "N/A"}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-4">
          <FiMapPin
            className="
              text-green-600
              text-xl
              mt-1
            "
          />

          <div>
            <p className="text-sm text-gray-500">
              Shipping Address
            </p>

            <div className="font-semibold dark:text-white space-y-1">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}
                {order.shippingAddress?.zip
                  ? `, ${order.shippingAddress.zip}`
                  : ""}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}