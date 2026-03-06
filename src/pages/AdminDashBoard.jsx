import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiPlus,
} from "react-icons/fi"; 
import useDocumentTitle from "../hooks/useDocumentTitle";

import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { useGetOrdersQuery } from "../features/orders/ordersApiSlice";

export default function AdminDashboard() {
  useDocumentTitle('dashboard')
  const { status, username } = useAuth();

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrdersQuery();

  const totalUsers = usersData?.ids?.length || 0;
  const totalOrders = ordersData?.ids?.length || 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col md:min-h-screen">
        <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
          <Link className="flex items-center gap-3 hover:text-black dark:hover:text-white" to="/admin/orders">
            <FiShoppingCart /> Orders
          </Link>
        
          <Link className="flex items-center gap-3 hover:text-black dark:hover:text-white" to="/users">
            <FiUsers /> Customers
          </Link>
         
          <Link className="flex items-center gap-3 hover:text-black dark:hover:text-white" to="/settings">
            <FiSettings /> Settings
          </Link>

          
          <Link className="flex items-center gap-3  text-black dark:hover:text-white mt-4 font-semibold text-green-600" to="/create-product">
            <FiPlus /> Add Product
          </Link>

          <p className="mt-4 text-green-600 font-semibold">Status: {status}</p>
        </nav>
      </aside>

      
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Hi, {username} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1 text-sm sm:text-base">
            Welcome back to your dashboard
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center justify-between transition transform hover:-translate-y-1 hover:shadow-xl">
            <div>
              <p className="text-gray-500 dark:text-gray-300 font-medium text-sm sm:text-base">Total Users</p>
              {isUsersLoading ? (
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 animate-pulse">Loading...</p>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalUsers}</p>
              )}
            </div>
            <FiUsers className="text-3xl sm:text-4xl text-blue-500" />
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center justify-between transition transform hover:-translate-y-1 hover:shadow-xl">
            <div>
              <p className="text-gray-500 dark:text-gray-300 font-medium text-sm sm:text-base">Total Orders</p>
              {isOrdersLoading ? (
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 animate-pulse">Loading...</p>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalOrders}</p>
              )}
            </div>
            <FiShoppingCart className="text-3xl sm:text-4xl text-green-500" />
          </div>
        </div>
      </main>
    </div>
  );
}