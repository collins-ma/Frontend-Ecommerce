import React from "react";
import { Link } from "react-router-dom";

import {
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiPlus,
  FiClock,
  FiCheckCircle,
    FiRefreshCw,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

import { useGetUsersQuery } from "../features/users/usersApiSlice";
import { useGetOrdersQuery } from "../features/orders/ordersApiSlice";


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



  const users =
    usersData?.ids?.length || 0;


  const orders =
    ordersData?.ids?.length || 0;



  const orderList =
    ordersData?.entities
      ? Object.values(ordersData.entities)
      : [];



  const pendingOrders =
    orderList.filter(
      (order)=> order.orderStatus === "pending"
    ).length;



  const completedOrders =
    orderList.filter(
      (order)=> order.orderStatus === "delivered"
    ).length;



  const cards = [

    {
      title:"Total Users",
      value:users,
      icon:FiUsers,
      color:"text-blue-600"
    },


    {
      title:"Total Orders",
      value:orders,
      icon:FiShoppingCart,
      color:"text-green-600"
    },


    {
      title:"Pending Orders",
      value:pendingOrders,
      icon:FiClock,
      color:"text-yellow-600"
    },


    {
      title:"Completed Orders",
      value:completedOrders,
      icon:FiCheckCircle,
      color:"text-purple-600"
    }

  ];



  return (

    <div
      className="
      min-h-screen
      flex
      flex-col
      md:flex-row
      bg-gray-100
      dark:bg-gray-900
      text-gray-900
      dark:text-gray-100
      "
    >


      {/* Sidebar */}

      <aside
        className="
        w-full
        md:w-64
        bg-white
        dark:bg-gray-800
        shadow-lg
        p-6
        "
      >

        <h2
          className="
          text-xl
          font-bold
          mb-6
          "
        >
          Admin Panel
        </h2>



        <nav
          className="
          flex
          flex-col
          gap-5
          "
        >


          <Link
            to="/admin/orders"
            className="
            hover:text-blue-600
            "
          >
            Orders
          </Link>

          <Link
  to="/admin/returns"
  className="
    flex
    items-center
    gap-2
    hover:text-blue-600
  "
>
  <FiRefreshCw />
  Returns
</Link>



          <Link
            to="/users"
            className="
            flex
            items-center
            gap-2
            hover:text-blue-600
            "
          >
            <FiUsers/>
            Customers
          </Link>



          <Link
            to="/settings"
            className="
            flex
            items-center
            gap-2
            hover:text-blue-600
            "
          >
            <FiSettings/>
            Settings
          </Link>



          <Link
            to="/create-product"
            className="
            flex
            items-center
            gap-2
            text-green-600
            font-semibold
            "
          >
            <FiPlus/>
            Add Product
          </Link>



          <p
            className="
            mt-5
            text-sm
            text-green-600
            font-semibold
            "
          >
            Status: {status}
          </p>


        </nav>


      </aside>






      {/* Main Content */}


      <main
        className="
        flex-1
        p-6
        "
      >


        <div
          className="
          mb-8
          "
        >

          <h1
            className="
            text-3xl
            font-bold
            "
          >
            Hi, {username} 👋
          </h1>


          <p
            className="
            text-gray-500
            dark:text-gray-400
            mt-2
            "
          >
            Welcome back to your dashboard
          </p>


        </div>






        {/* Cards */}


        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          "
        >


          {
            cards.map((card)=>{


              const Icon =
                card.icon;


              return (

                <div
                  key={card.title}
                  className="
                  bg-white
                  dark:bg-gray-800
                  rounded-2xl
                  shadow
                  p-6
                  flex
                  items-center
                  justify-between
                  hover:shadow-xl
                  transition
                  "
                >


                  <div>

                    <p
                      className="
                      text-gray-500
                      dark:text-gray-400
                      "
                    >
                      {card.title}
                    </p>


                    <h2
                      className="
                      text-3xl
                      font-bold
                      mt-2
                      "
                    >

                      {
                        loadingUsers || loadingOrders
                        ?
                        "..."
                        :
                        card.value
                      }


                    </h2>


                  </div>



                  <Icon
                    className={`
                    text-4xl
                    ${card.color}
                    `}
                  />


                </div>

              );


            })
          }


        </div>




      </main>


    </div>

  );

}