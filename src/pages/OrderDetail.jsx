import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "../features/orders/ordersApiSlice";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: orderState, isLoading, isError, error } = useGetOrderByIdQuery(id);

  if (isLoading)
    return (
      <div className="text-center p-6 text-gray-600">Loading order details...</div>
    );

  if (isError || !orderState)
    return (
      <div className="text-center p-6 text-red-600 font-semibold">
        {error?.data?.message || "Failed to fetch order"}
      </div>
    );

  const order = orderState.entities ? orderState.entities[id] : orderState;

  if (!order)
    return <div className="text-center p-6 text-red-600">Order not found.</div>;

  // Payment icon + color
  let PaymentIcon, paymentColor;
  switch ((order.paymentStatus || "").toLowerCase()) {
    case "paid":
      PaymentIcon = FiCheckCircle;
      paymentColor = "bg-green-100 text-green-700";
      break;
    case "failed":
      PaymentIcon = FiXCircle;
      paymentColor = "bg-red-100 text-red-700";
      break;
    default:
      PaymentIcon = FiClock;
      paymentColor = "bg-yellow-100 text-yellow-700";
  }

  const statusColor =
    order.status === "failed"
      ? "bg-red-100 text-red-700"
      : order.status === "success"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        ← Back to Orders
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-xl rounded-2xl">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Shipping
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Failure Reason
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-purple-50 cursor-default transition">
              <td className="px-6 py-4 text-sm text-gray-800">{order._id}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{order.user?.name || order.user?._id || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {order.items?.length > 0
                  ? order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.product?.name || item.product?._id} | Qty: {item.quantity} | ${item.priceUSD}
                      </div>
                    ))
                  : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">${order.total}</td>
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
              <td className="px-6 py-4 text-sm text-gray-800">
                {order.shippingAddress
                  ? `${order.shippingAddress.name}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}, ${order.shippingAddress.phone}`
                  : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-red-600">{order.failureReason || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
