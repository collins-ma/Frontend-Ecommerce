import {
  FiUser,
  FiPhone,
  FiHome,
  FiMapPin,
  FiMail,
} from "react-icons/fi";
import React from "react";

export default function ShippingAddress({ address }) {
  if (!address) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recipient */}
        <div className="flex items-start gap-3">
          <FiUser className="text-blue-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Recipient
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {address.name}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <FiPhone className="text-green-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Phone Number
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {address.phone || "-"}
            </p>
          </div>
        </div>

        {/* Street */}
        <div className="flex items-start gap-3">
          <FiHome className="text-orange-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Street
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {address.street}
            </p>
          </div>
        </div>

        {/* City */}
        <div className="flex items-start gap-3">
          <FiMapPin className="text-red-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              City
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {address.city}
            </p>
          </div>
        </div>

        {/* ZIP Code */}
        <div className="flex items-start gap-3">
          <FiMail className="text-purple-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              ZIP Code
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {address.zip}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}