import React from "react";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OrdersTable({ orders }) {
  const navigate = useNavigate();

  if (!orders?.length) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No orders available.
      </p>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-x-auto p-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => {
            // Payment Icon + color
            let PaymentIcon, paymentColor;
            switch (order.paymentStatus?.toLowerCase()) {
              case "paid":
                PaymentIcon = FiCheckCircle;
                paymentColor = "text-green-600";
                break;
              case "failed":
                PaymentIcon = FiXCircle;
                paymentColor = "text-red-600";
                break;
              case "pending":
              default:
                PaymentIcon = FiClock;
                paymentColor = "text-yellow-600";
            }

            // Status color badge
            const statusColor =
              order.status === "failed"
                ? "bg-red-100 text-red-700"
                : order.status === "success"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700";

            return (
              <tr
                key={order._id}
                className="hover:bg-purple-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{order._id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{order.user?.name || order.user?._id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {order.items?.map((item, idx) => (
                    <div key={idx}>
                      {item.product?.name || item.product?._id} | Qty: {item.quantity} | ${item.priceUSD}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">${order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs font-semibold leading-5 rounded-full ${statusColor}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-1 text-sm font-medium">
                  <PaymentIcon className={`${paymentColor} w-5 h-5`} />
                  <span>{order.paymentStatus}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
