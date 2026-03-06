import React from "react";
import OrdersTable from "./OrdersTable";
import { useGetOrdersQuery } from "../features/orders/ordersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

export default function OrdersList() {
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetOrdersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PulseLoader color="#4F46E5" />
      </div>
    );

  
  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-center text-lg">
          {error?.data?.message || "Failed to load orders."}
        </p>
      </div>
    );

  
  let orders = [];
  if (isSuccess) {
    const { ids = [], entities = {} } = ordersData;
    orders = ids.map((id) => entities[id]);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Orders Dashboard
      </h1>

      
      <div className="overflow-x-auto">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}