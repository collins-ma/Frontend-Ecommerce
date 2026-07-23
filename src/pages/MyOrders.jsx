import PulseLoader from "react-spinners/PulseLoader";
import { useGetMyOrdersQuery } from "../features/orders/ordersApiSlice";
import OrderCard from "./OrderCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import React from "react";
export default function MyOrders() {
  useDocumentTitle("My Orders");

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetMyOrdersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PulseLoader color="#2563EB" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-medium">
          {error?.data?.message || "Failed to load your orders."}
        </p>
      </div>
    );
  }

  let orders = [];

  if (isSuccess) {
    const { ids = [], entities = {} } = ordersData;
    orders = ids.map((id) => entities[id]);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}