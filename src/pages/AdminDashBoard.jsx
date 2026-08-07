import React from "react";
import { Link } from "react-router-dom";
import NotificationsBell from "./NotificationsBell";
import {
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
  FiDollarSign,
   FiTruck,
  FiPackage,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

import { useGetUsersQuery } from "../features/users/usersApiSlice";

import {
  useGetOrdersQuery,
  useGetTodaySalesQuery,
  useGetWeeklySalesQuery,
} from "../features/orders/ordersApiSlice";

export default function AdminDashboard() {
  useDocumentTitle("dashboard");

  const { status, username } = useAuth();

  const {
    data: usersData,
    isLoading: loadingUsers,
  } = useGetUsersQuery();

  const {
    data: ordersData,
    isLoading: loadingOrders,
  } = useGetOrdersQuery();

  const {
    data: todaySales,
    isLoading: loadingTodaySales,
  } = useGetTodaySalesQuery();

  const {
    data: weeklySales,
    isLoading: loadingWeeklySales,
  } = useGetWeeklySalesQuery();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount ?? 0);

  const users = usersData?.ids?.length || 0;

  const orders = ordersData?.ids?.length || 0;

  const orderList = ordersData?.entities
    ? Object.values(ordersData.entities)
    : [];

  const pendingOrders = orderList.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const completedOrders = orderList.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const cards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(todaySales?.sales),
      subtitle: `${todaySales?.orders ?? 0} Orders Today`,
      icon: FiDollarSign,
      color: "text-emerald-600",
      loading: loadingTodaySales,
    },

    {
      title: "Weekly Revenue",
      value: formatCurrency(weeklySales?.sales),
      subtitle: `${weeklySales?.orders ?? 0} Orders This Week`,
      icon: FiDollarSign,
      color: "text-green-600",
      loading: loadingWeeklySales,
    },

    {
      title: "Total Users",
      value: users,
      subtitle: "Registered Customers",
      icon: FiUsers,
      color: "text-blue-600",
      loading: loadingUsers,
    },

    {
      title: "Total Orders",
      value: orders,
      subtitle: "All Orders",
      icon: FiShoppingCart,
      color: "text-indigo-600",
      loading: loadingOrders,
    },

    {
      title: "Pending Orders",
      value: pendingOrders,
      subtitle: "Awaiting Processing",
      icon: FiClock,
      color: "text-yellow-600",
      loading: loadingOrders,
    },

    {
      title: "Completed Orders",
      value: completedOrders,
      subtitle: "Successfully Delivered",
      icon: FiCheckCircle,
      color: "text-purple-600",
      loading: loadingOrders,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Sidebar */}

      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg p-6">

        <h2 className="text-xl font-bold mb-6">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-5">

          <Link
            to="/admin/orders"
            className="hover:text-blue-600"
          >
            Orders
          </Link>

          <Link
            to="/admin/returns"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <FiRefreshCw />
            Returns
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <FiUsers />
            Customers
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <FiSettings />
            Settings
          </Link>

          <Link
            to="/create-product"
            className="flex items-center gap-2 text-green-600 font-semibold"
          >
            <FiPlus />
            Add Product
          </Link>


          <Link
  to="/admin/categories/create"
  className="flex items-center gap-2 hover:text-blue-600"
>
  <FiPlus />
  Create Category
</Link>



<Link
  to="/purchases"
  className="flex items-center gap-2 hover:text-blue-600"
>
  <FiPackage />
  Purchases
</Link>

<Link
  to="/suppliers"
  className="flex items-center gap-2 hover:text-blue-600"
>
  <FiTruck />
  Suppliers
</Link>
          <p className="mt-5 text-sm text-green-600 font-semibold">
            Status: {status}
          </p>

        </nav>

      </aside>

      {/* Main */}

      <main className="flex-1 p-6">

       <div className="mb-8 flex items-start justify-between">

  <div>

    <h1 className="text-3xl font-bold">
      Hi, {username} 👋
    </h1>

    <p className="text-gray-500 dark:text-gray-400 mt-2">
      Welcome back to your dashboard
    </p>

  </div>

  <NotificationsBell />

</div>
        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {cards.map((card) => {

            const Icon = card.icon;

            return (

              <div
                key={card.title}
                className="
                  bg-white
                  dark:bg-gray-800
                  rounded-2xl
                  shadow
                  hover:shadow-xl
                  transition
                  p-6
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">

                    {card.loading
                      ? "..."
                      : card.value}

                  </h2>

                  <p className="text-sm text-gray-500 mt-2">

                    {card.loading
                      ? ""
                      : card.subtitle}

                  </p>

                </div>

                <div
                  className="
                    h-16
                    w-16
                    rounded-full
                    bg-gray-100
                    dark:bg-gray-700
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Icon
                    className={`text-3xl ${card.color}`}
                  />

                </div>

              </div>

            );

          })}

        </div>

      </main>

    </div>
  );
}