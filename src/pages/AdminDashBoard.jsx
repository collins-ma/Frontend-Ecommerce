import React from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiShoppingCart,
  FiLayers,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiSearch
} from "react-icons/fi";

export default function AdminDashboard() {
  const { status } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        

        <nav className="flex flex-col gap-5 text-gray-700">

       
          <Link className="flex items-center gap-3 hover:text-black" to="/admin/orders">
            <FiShoppingCart /> Orders
          </Link>

          <Link className="flex items-center gap-3 hover:text-black" to="/inventory">
            <FiLayers /> Inventory
          </Link>

          <Link className="flex items-center gap-3 hover:text-black" to="/users">
            <FiUsers /> Customers
          </Link>

          <Link className="flex items-center gap-3 hover:text-black" to="/analytics">
            <FiBarChart2 /> Analytics
          </Link>

          <Link className="flex items-center gap-3 hover:text-black" to="/settings">
            <FiSettings /> Settings
          </Link>

          {/* ✔️ Status Display */}
          <p className="mt-4 text-green-600 font-semibold">
            Status: {status}
          </p>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-1/2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full"
            />
          </div>

          {/* Right Section: Notifications */}
          <div className="flex items-center gap-6">
            <FiBell className="text-2xl cursor-pointer text-gray-600 hover:text-black" />
          </div>

        </div>

        {/* Placeholder for future content */}
        <div className="bg-white rounded-xl shadow p-10 text-gray-400 text-center">
          Your dashboard content goes here…
        </div>

      </main>
    </div>
  );
}
