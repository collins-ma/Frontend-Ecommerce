import {
  FiCalendar,
  FiCreditCard,
  FiHash,
  FiDollarSign,
} from "react-icons/fi";
import React from "react";

export default function OrderSummary({ order }) {
  const orderStatusColors = {
    PENDING: "bg-yellow-500",
    CONFIRMED: "bg-blue-500",
    PROCESSING: "bg-purple-500",
    SHIPPED: "bg-indigo-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  const paymentStatusColors = {
    PENDING: "bg-yellow-500",
    PAID: "bg-green-500",
    FAILED: "bg-red-500",
    REFUND_PENDING: "bg-orange-500",
    REFUNDED: "bg-purple-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Order Number */}
        <div className="flex items-start gap-3">
          <FiHash className="text-blue-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Order Number
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Date */}
        <div className="flex items-start gap-3">
          <FiCalendar className="text-blue-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Ordered On
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-start gap-3">
          <FiDollarSign className="text-green-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="font-bold text-2xl text-green-600">
              KSh {order.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Checkout Method */}
        <div className="flex items-start gap-3">
          <FiCreditCard className="text-blue-600 text-xl mt-1" />

          <div>
            <p className="text-sm text-gray-500">
              Checkout Method
            </p>

            <p className="font-semibold text-gray-900 dark:text-white">
              {order.checkoutMethod}
            </p>
          </div>
        </div>

      </div>

      <div className="border-t dark:border-gray-700 my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Order Status */}
        <div>

          <p className="text-sm text-gray-500 mb-2">
            Order Status
          </p>

          <div className="flex items-center gap-2">

            <span
              className={`w-3 h-3 rounded-full ${
                orderStatusColors[order.orderStatus]
              }`}
            />

            <span className="font-semibold text-gray-900 dark:text-white">
              {order.orderStatus.replaceAll("_", " ")}
            </span>

          </div>

        </div>

        {/* Payment Status */}

        <div>

          <p className="text-sm text-gray-500 mb-2">
            Payment Status
          </p>

          <div className="flex items-center gap-2">

            <span
              className={`w-3 h-3 rounded-full ${
                paymentStatusColors[order.paymentStatus]
              }`}
            />

            <span className="font-semibold text-gray-900 dark:text-white">
              {order.paymentStatus.replaceAll("_", " ")}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}