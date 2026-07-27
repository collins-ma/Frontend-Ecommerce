import React from "react";
import { Link } from "react-router-dom";

import {
  FiCalendar,
  FiShoppingBag,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";

import RequestReturnModal from "./RequestReturnModal";
import { useRequestReturnMutation} from "../features/returns/returnsApiSlice";

export default function OrderCard({ order }) {

  const [
  requestReturn,
  {
    isLoading,
  },
] = useRequestReturnMutation();

  const [showReturnModal, setShowReturnModal] = useState(false);

  if (!order) return null;



  const {
    _id,
    orderStatus = "PENDING",
    paymentStatus = "PENDING",
    checkoutMethod = "N/A",
    total = 0,
    items = [],
    createdAt,
  } = order;





  const orderStatusColors = {

    PENDING:
      "bg-yellow-500",

    CONFIRMED:
      "bg-green-500",

    PROCESSING:
      "bg-emerald-600",

    SHIPPED:
      "bg-teal-500",

    DELIVERED:
      "bg-green-700",

    CANCELLED:
      "bg-red-500",

  };





  const paymentStatusColors = {

    PENDING:
      "bg-yellow-500",

    PAID:
      "bg-green-600",

    FAILED:
      "bg-red-500",

    REFUND_PENDING:
      "bg-orange-500",

    REFUNDED:
      "bg-green-700",

  };




const handleRequestReturn = async (returnedItems) => {
    console.log("Sending to API:", returnedItems);
  try {
    await requestReturn({
      orderId: _id,
      returnedItems,
    }).unwrap();

    alert("Return request submitted successfully.");

    setShowReturnModal(false);

  } catch (err) {
    console.error(err);

    alert(
      err?.data?.message ||
      "Failed to submit return request."
    );
  }
};


  return (


    <div

      className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow-sm
        hover:shadow-lg
        border
        hover:border-green-500
        transition-all
        duration-300
        p-4
        flex
        flex-col
      "

    >






      {/* Header */}

      <div className="
        flex
        justify-between
        items-center
      ">




        {/* Status */}

        <div className="
          flex
          items-center
          gap-2
        ">


          <span

            className={`
              w-3
              h-3
              rounded-full
              ${orderStatusColors[orderStatus]}
            `}

          />



          <span

            className="
              font-semibold
              text-sm
              text-gray-800
              dark:text-gray-100
            "

          >

            {orderStatus.replaceAll("_"," ")}

          </span>


        </div>






        {/* Date */}

        <div

          className="
            flex
            items-center
            gap-1
            text-gray-500
            text-xs
          "

        >

          <FiCalendar size={14}/>


          {
            createdAt
            ?
            new Date(createdAt).toLocaleDateString()
            :
            "N/A"
          }


        </div>



      </div>









      {/* Order Number */}

      <div className="mt-3">


        <p className="
          text-gray-500
          text-xs
        ">

          Order Number

        </p>




        <h2

          className="
            text-lg
            font-bold
            text-gray-900
            dark:text-white
          "

        >

          #{_id?.slice(-8).toUpperCase()}

        </h2>



      </div>









      {/* Total */}

      <div className="mt-3">


        <p className="
          text-gray-500
          text-xs
        ">

          Total

        </p>



        <h1

          className="
            text-2xl
            font-bold
            text-green-600
            dark:text-green-400
          "

        >

          KSh {total.toLocaleString()}


        </h1>



      </div>









      {/* Items */}

      <div

        className="
          mt-4
          flex
          items-center
          gap-2
          text-gray-700
          dark:text-gray-300
        "

      >


        <FiShoppingBag/>


        <span className="text-sm">


          {items.length}


          {" "}


          {
            items.length === 1
            ?
            "Item"
            :
            "Items"
          }


        </span>


      </div>









      {/* Payment and Checkout */}

      <div

        className="
          mt-4
          grid
          grid-cols-2
          gap-4
        "

      >






        {/* Payment */}

        <div>


          <p className="
            text-gray-500
            text-xs
            mb-1
          ">

            Payment

          </p>




          <div className="
            flex
            items-center
            gap-2
          ">


            <span

              className={`
                w-3
                h-3
                rounded-full
                ${paymentStatusColors[paymentStatus]}
              `}

            />


            <span

              className="
                text-sm
                font-medium
                text-gray-800
                dark:text-gray-200
              "

            >

              {paymentStatus.replaceAll("_"," ")}

            </span>



          </div>



        </div>









        {/* Checkout */}

        <div>


          <p className="
            text-gray-500
            text-xs
            mb-1
          ">

            Checkout

          </p>




          <div

            className="
              flex
              items-center
              gap-2
              text-gray-800
              dark:text-gray-200
            "

          >


            <FiCreditCard size={16}/>



            <span className="text-sm">


              {
                checkoutMethod === "MPESA"
                ?
                "M-Pesa"
                :
                "Cash"
              }


            </span>



          </div>



        </div>




      </div>









      {/* Divider */}

      <div

        className="
          border-t
          dark:border-gray-700
          my-4
        "

      />









      {/* View Details */}

      <Link


        to={`/orders/${_id}`}


        className="

          w-full

          bg-black

          hover:bg-gray-800

          text-white

          py-2.5

          rounded-lg

          flex

          justify-center

          items-center

          gap-2

          font-medium

          transition

          shadow-sm

          text-sm

        "


      >

        View Details


        <FiArrowRight/>


      </Link>


      {
  orderStatus === "delivered" &&
  paymentStatus === "paid" && (
    <button
      onClick={() => setShowReturnModal(true)}
      className="
        mt-3
        w-full
        bg-blue-600
        hover:bg-blue-700
        text-white
        py-2.5
        rounded-lg
        font-medium
        transition
      "
    >
      Request Return
    </button>
  )
}


<RequestReturnModal
  isOpen={showReturnModal}
  order={order}
  loading={isLoading}
  onClose={() => setShowReturnModal(false)}
  onConfirm={handleRequestReturn}
/>


    </div>


  );

}