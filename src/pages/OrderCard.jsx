import React from "react";

export default function OrderCard({ order }) {
  if (!order) return null;

  const { _id, status, paymentMethod, total, items = [], createdAt } = order;

  return (
    <div className="
      bg-white dark:bg-gray-800
      rounded-2xl shadow-md dark:shadow-lg
      p-4 flex flex-col
    ">
      {/* Order ID */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Order ID:</p>
        <p className="text-gray-800 dark:text-gray-100 font-medium">{_id}</p>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Status:</p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "paid"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Payment */}
      <div className="mb-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Payment Method:
        </p>
        <p className="text-gray-800 dark:text-gray-100">{paymentMethod}</p>
      </div>

      {/* Total */}
      <div className="mb-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Total:</p>
        <p className="text-gray-800 dark:text-gray-100 font-semibold">
          ${total}
        </p>
      </div>

      {/* Items */}
      <div className="mb-2">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Items:</p>
        <ul className="mt-1 space-y-1">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between text-gray-800 dark:text-gray-200 text-sm"
            >
              <span>{item.product?.name || "Product"}</span>
              <span>Qty: {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Date */}
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-auto">
        Ordered on:{" "}
        {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
}