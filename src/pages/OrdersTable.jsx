import React, { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronRight,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";


export default function OrdersTable({ orders }) {

  useDocumentTitle("orders");

  const navigate = useNavigate();


  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");



  if (!orders?.length) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No orders available.
      </p>
    );
  }




  const filteredOrders = orders.filter((order)=>{


    const username =
      order.user?.username?.toLowerCase() || "";


    const orderId =
      order._id?.toLowerCase() || "";



    const searchValue =
      search.toLowerCase();



    const matchesSearch =
      username.includes(searchValue) ||
      orderId.includes(searchValue);



    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus === statusFilter;



    return (
      matchesSearch &&
      matchesStatus
    );

  });





  const getStatusStyle = (status)=>{

    switch(status){

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "shipped":
        return "bg-indigo-100 text-indigo-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };





  const getPaymentIcon = (status)=>{


    switch(status?.toLowerCase()){


      case "paid":
        return {
          Icon:FiCheckCircle,
          color:"text-green-600"
        };


      case "failed":
      case "refunded":
        return {
          Icon:FiXCircle,
          color:"text-red-600"
        };


      default:

        return {
          Icon:FiClock,
          color:"text-yellow-600"
        };


    }

  };





  return (

    <div className="w-full">



      {/* Search + Filter */}

      <div
        className="
        mb-6
        flex
        flex-col
        md:flex-row
        gap-4
        "
      >


        <div
          className="
          relative
          flex-1
          "
        >

          <FiSearch
            className="
            absolute
            left-3
            top-3.5
            text-gray-400
            "
          />


          <input

            type="text"

            placeholder="
            Search customer or order ID...
            "

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            className="
            w-full
            pl-10
            pr-4
            py-3
            rounded-xl
            border
            dark:bg-gray-800
            dark:border-gray-700
            dark:text-white
            "

          />


        </div>





        <select

          value={statusFilter}

          onChange={(e)=>
            setStatusFilter(e.target.value)
          }

          className="
          rounded-xl
          border
          px-4
          py-3
          dark:bg-gray-800
          dark:border-gray-700
          dark:text-white
          "

        >

          <option value="all">
            All Orders
          </option>


          <option value="pending">
            Pending
          </option>


          <option value="confirmed">
            Confirmed
          </option>


          <option value="processing">
            Processing
          </option>


          <option value="shipped">
            Shipped
          </option>


          <option value="delivered">
            Delivered
          </option>


          <option value="cancelled">
            Cancelled
          </option>


        </select>


      </div>








      {/* Desktop Table */}


      <div
        className="
        hidden
        md:block
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow-xl
        overflow-x-auto
        "
      >


      <table
        className="
        min-w-full
        "
      >


        <thead
          className="
          bg-gray-100
          dark:bg-gray-700
          "
        >

          <tr>


            <th className="px-6 py-4 text-left">
              Order
            </th>


            <th className="px-6 py-4 text-left">
              Customer
            </th>


            <th className="px-6 py-4 text-left">
              Items
            </th>


            <th className="px-6 py-4 text-left">
              Total
            </th>


            <th className="px-6 py-4 text-left">
              Status
            </th>


            <th className="px-6 py-4 text-left">
              Payment
            </th>


          </tr>

        </thead>





        <tbody>


        {
          filteredOrders.map((order)=>{


            const payment =
              getPaymentIcon(
                order.paymentStatus
              );


            const PaymentIcon =
              payment.Icon;



            return (

            <tr

              key={order._id}


              onClick={()=>
                navigate(
                  `/admin/orders/${order._id}`
                )
              }


              className="
              cursor-pointer
              hover:bg-gray-50
              dark:hover:bg-gray-700
              "

            >


              <td className="px-6 py-4 font-semibold">

                #{order._id.slice(-8)}

              </td>



              <td className="px-6 py-4">

                {
                  order.user?.username ||
                  "Unknown"
                }

              </td>




              <td className="px-6 py-4">

                <div className="flex gap-2 items-center">

                  <FiPackage/>

                  {order.items?.length || 0}

                  items

                </div>

              </td>





              <td className="px-6 py-4 font-semibold">

                KSh {order.total}

              </td>




              <td className="px-6 py-4">


                <span
                className={`
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                ${getStatusStyle(order.orderStatus)}
                `}
                >

                  {order.orderStatus}

                </span>


              </td>





              <td className="px-6 py-4 flex items-center gap-2">


                <PaymentIcon
                  className={`
                  ${payment.color}
                  w-5
                  h-5
                  `}
                />


                {order.paymentStatus}


              </td>



            </tr>

            );


          })
        }



        </tbody>



      </table>


      </div>









      {/* Mobile Cards */}


      <div
        className="
        md:hidden
        flex
        flex-col
        gap-4
        "
      >


      {
        filteredOrders.map((order)=>{


          const payment =
          getPaymentIcon(
            order.paymentStatus
          );


          const PaymentIcon =
          payment.Icon;



          return (

          <div

          key={order._id}


          onClick={()=>
            navigate(
              `/admin/orders/${order._id}`
            )
          }


          className="
          bg-white
          dark:bg-gray-800
          rounded-xl
          shadow
          p-5
          cursor-pointer
          "

          >


            <div
            className="
            flex
            justify-between
            "
            >

              <b>
                #{order._id.slice(-8)}
              </b>


              <span
              className={`
              px-2
              py-1
              rounded-full
              text-xs
              ${getStatusStyle(order.orderStatus)}
              `}
              >

                {order.orderStatus}

              </span>


            </div>




            <p className="mt-3">

              Customer:

              <b className="ml-2">

              {
                order.user?.username ||
                "Unknown"
              }

              </b>

            </p>




            <p>

              Items:
              {order.items?.length || 0}

            </p>




            <p className="font-semibold">

              Total:
              KSh {order.total}

            </p>




            <div
            className="
            flex
            items-center
            gap-2
            mt-3
            "
            >

              <PaymentIcon
                className={`
                ${payment.color}
                `}
              />

              {order.paymentStatus}


              <FiChevronRight
                className="ml-auto"
              />


            </div>




          </div>

          );


        })
      }



      </div>



    </div>

  );

}