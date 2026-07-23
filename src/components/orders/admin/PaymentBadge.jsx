import React from "react";

export default function PaymentBadge({ status }) {
  const value = status?.toLowerCase() || "";

  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refund_pending: "bg-orange-100 text-orange-700",
    refunded: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        capitalize
        ${styles[value] || "bg-gray-100 text-gray-700"}
      `}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}