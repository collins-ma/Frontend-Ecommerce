import React from "react";

export default function PaymentCard({ order }) {
  if (!order) return null;

  return (
    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow
        p-6
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-6
          dark:text-white
        "
      >
        Payment Information
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Checkout Method
          </span>

          <span className="font-semibold dark:text-white">
            {order.checkoutMethod}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">
            Payment Status
          </span>

          <span
            className={`
              font-semibold
              ${
                order.paymentStatus === "PAID"
                  ? "text-green-600"
                  : order.paymentStatus === "FAILED"
                  ? "text-red-600"
                  : order.paymentStatus === "REFUND_PENDING"
                  ? "text-orange-600"
                  : order.paymentStatus === "REFUNDED"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }
            `}
          >
            {order.paymentStatus.replaceAll("_", " ")}
          </span>
        </div>

        {order.paymentChannel && (
          <div className="flex justify-between">
            <span className="text-gray-500">
              Payment Channel
            </span>

            <span className="font-semibold dark:text-white">
              {order.paymentChannel}
            </span>
          </div>
        )}

        {order.transactionId && (
          <div className="flex justify-between gap-5">
            <span className="text-gray-500">
              Transaction ID
            </span>

            <span className="font-semibold dark:text-white break-all">
              {order.transactionId}
            </span>
          </div>
        )}

        {order.paidAt && (
          <div className="flex justify-between">
            <span className="text-gray-500">
              Paid At
            </span>

            <span className="font-semibold dark:text-white">
              {new Date(order.paidAt).toLocaleString()}
            </span>
          </div>
        )}

        {order.refundChannel && (
          <div className="flex justify-between">
            <span className="text-gray-500">
              Refund Channel
            </span>

            <span className="font-semibold dark:text-white">
              {order.refundChannel}
            </span>
          </div>
        )}

        {order.refundTransactionId && (
          <div className="flex justify-between gap-5">
            <span className="text-gray-500">
              Refund Transaction
            </span>

            <span className="font-semibold dark:text-white break-all">
              {order.refundTransactionId}
            </span>
          </div>
        )}

        {order.refundedAt && (
          <div className="flex justify-between">
            <span className="text-gray-500">
              Refunded At
            </span>

            <span className="font-semibold dark:text-white">
              {new Date(order.refundedAt).toLocaleString()}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}