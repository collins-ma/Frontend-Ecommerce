import React from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function OrdersTable({ orders }) {
  useDocumentTitle("orders");
  const navigate = useNavigate();

  if (!orders?.length) {
    return (
      <p className="text-gray-500 dark:text-gray-300 text-center mt-10">
        No orders available.
      </p>
    );
  }

  return (
    <div className="w-full">
      
      <div className="hidden md:block bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-x-auto p-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => {
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
                default:
                  PaymentIcon = FiClock;
                  paymentColor = "text-yellow-600";
              }

              const statusColor =
                order.status === "failed"
                  ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                  : order.status === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300";

              return (
                <tr
                  key={order._id}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors cursor-pointer"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{order.user?.name || order.user?._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {order.items?.map((item, idx) => (
                      <div key={idx}>
                        {item.product?.name || item.product?._id} | Qty: {item.quantity} | ${item.priceUSD}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">${order.total}</td>
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

      
      <div className="md:hidden flex flex-col gap-4">
        {orders.map((order) => {
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
            default:
              PaymentIcon = FiClock;
              paymentColor = "text-yellow-600";
          }

          const statusColor =
            order.status === "failed"
              ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
              : order.status === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300";

          return (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{order._id}</span>
                <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">
                User: {order.user?.name || order.user?._id}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1">
                Items: {order.items?.map((item, idx) => (
                  <span key={idx}>
                    {item.product?.name || item.product?._id} x{item.quantity}${item.priceUSD}{idx < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
              <div className="text-gray-800 dark:text-gray-200 mb-1 font-medium">
                Total: ${order.total}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <PaymentIcon className={`${paymentColor} w-5 h-5`} />
                <span className="text-gray-700 dark:text-gray-200">{order.paymentStatus}</span>
                <FiChevronRight className="ml-auto text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}