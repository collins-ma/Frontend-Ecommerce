import React from "react";
import OrdersTable from "./OrdersTable";
import { useGetOrdersQuery } from "../features/orders/ordersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

export default function OrdersList() {
  const { data: ordersData, isLoading, isError, error, isSuccess }
  =
  useGetOrdersQuery('ordersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true});

  // Loading state
  if (isLoading)
    return (
      <div className="flex justify-center mt-10">
        <PulseLoader />
      </div>
    );

  // Error state
  if (isError)
    return (
      <p className="text-red-600 text-center mt-10">
        {error?.data?.message || "Failed to load orders."}
      </p>
    );

  // Process orders
  let orders = [];
  if (isSuccess) {
    const { ids = [], entities = {} } = ordersData;
    orders = ids.map((id) => entities[id]);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Orders Dashboard
      </h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
