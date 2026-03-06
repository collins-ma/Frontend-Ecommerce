import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "../features/orders/ordersApiSlice";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";

const OrderDetail = () => {
  useDocumentTitle("orderdetails");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: orderState, isLoading, isError, error } = useGetOrderByIdQuery(id);

  if (isLoading)
    return (
      <div className="text-center p-6 text-gray-600 dark:text-gray-300">
        Loading order details...
      </div>
    );

  if (isError || !orderState)
    return (
      <div className="text-center p-6 text-red-600 dark:text-red-400 font-semibold">
        {error?.data?.message || "Failed to fetch order"}
      </div>
    );

  const order = orderState.entities ? orderState.entities[id] : orderState;

  if (!order)
    return (
      <div className="text-center p-6 text-red-600 dark:text-red-400">Order not found.</div>
    );

  
  let PaymentIcon, paymentColor;
  switch ((order.paymentStatus || "").toLowerCase()) {
    case "paid":
      PaymentIcon = FiCheckCircle;
      paymentColor = "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300";
      break;
    case "failed":
      PaymentIcon = FiXCircle;
      paymentColor = "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300";
      break;
    default:
      PaymentIcon = FiClock;
      paymentColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300";
  }

  const statusColor =
    order.status === "failed"
      ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
      : order.status === "success"
      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300";

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <button
        onClick={() => navigate("/admin/orders")}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        ← Back to Orders
      </button>

      
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Shipping</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Failure Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-purple-50 dark:hover:bg-purple-900 transition">
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{order._id}</td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{order.user?.name || order.user?._id || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                {order.items?.length > 0
                  ? order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.product?.name || item.product?._id} | Qty: {item.quantity} | ${item.priceUSD}
                      </div>
                    ))
                  : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">${order.total}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${statusColor}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1 px-2 py-1 inline-flex text-xs font-semibold rounded-full ${paymentColor}`}>
                  <PaymentIcon className="w-4 h-4" />
                  {order.paymentStatus} ({order.paymentMethod || "N/A"})
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                {order.shippingAddress
                  ? `${order.shippingAddress.name}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}, ${order.shippingAddress.phone}`
                  : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{order.failureReason || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div className="md:hidden flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{order._id}</span>
            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusColor}`}>
              {order.status}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">
            User: {order.user?.name || order.user?._id || "-"}
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">
            Items: {order.items?.length > 0
              ? order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.product?.name || item.product?._id} x{item.quantity}${item.priceUSD}{idx < order.items.length - 1 ? ", " : ""}
                  </span>
                ))
              : "-"}
          </div>
          <div className="text-gray-800 dark:text-gray-200 font-medium mb-1">
            Total: ${order.total}
          </div>
          <div className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${paymentColor} mb-1`}>
            <PaymentIcon className="w-4 h-4 mr-1 inline" />
            {order.paymentStatus} ({order.paymentMethod || "N/A"})
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">
            Shipping: {order.shippingAddress
              ? `${order.shippingAddress.name}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}, ${order.shippingAddress.phone}`
              : "-"}
          </div>
          <div className="text-red-600 dark:text-red-400">
            Failure Reason: {order.failureReason || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;