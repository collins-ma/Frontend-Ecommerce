import { useGetMyOrdersQuery } from "../features/orders/ordersApiSlice";
import OrderCard from "./OrderCard";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import React from "react";

export default function MyOrders() {
    const { userId } = useAuth(); // Logged-in user's ID

    const {
        data: ordersData,
        isLoading,
        isError,
        error,
        isSuccess
    } = useGetMyOrdersQuery("myOrdersList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
     
    });

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

    if (isSuccess) {
        // Destructure ids and entities
        const { ids = [], entities = {} } = ordersData;

        // Map entities from ids
        const allOrders = ids.map(id => entities[id]);

       ;

        // Filter orders for the logged-in user
        const userOrders = allOrders.filter(order => order.user?._id === userId);

        if (!userOrders.length) {
            return (
                <p className="text-gray-500 text-center mt-10">
                    You have no orders yet.
                </p>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    My Orders
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {userOrders.map(order => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
