import React from "react";

export default function OrderActions({
  order,
  loading,

  onUpdateStatus,

  onRecordCashPayment,

  onOpenMpesaModal,

  onOpenRefundModal,

  onOpenCancelModal,
}) {


  if (!order) return null;


  const {
    orderStatus,
    paymentStatus,
    checkoutMethod,
  } = order;


  console.log("ORDER STATUS:", orderStatus);


  return (

    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow
        p-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-6
          dark:text-white
        "
      >
        Admin Actions
      </h2>



      <div className="space-y-4">


        {orderStatus === "pending" && (

          <button
            onClick={() =>
              onUpdateStatus("confirmed")
            }
            disabled={loading}

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              disabled:opacity-50
            "
          >
            Confirm Order
          </button>

        )}







        {orderStatus === "confirmed" && (

          <button
            onClick={() =>
              onUpdateStatus("processing")
            }

            disabled={loading}

            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              py-3
              rounded-xl
              disabled:opacity-50
            "
          >
            Start Processing
          </button>

        )}







        {orderStatus === "processing" && (

          <button
            onClick={() =>
              onUpdateStatus("shipped")
            }

            disabled={loading}

            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              text-white
              py-3
              rounded-xl
              disabled:opacity-50
            "
          >
            Mark as Shipped
          </button>

        )}







        {orderStatus === "shipped" && (

          <button
            onClick={() =>
              onUpdateStatus("delivered")
            }

            disabled={loading}

            className="
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-xl
              disabled:opacity-50
            "
          >
            Mark as Delivered
          </button>

        )}







        {
          checkoutMethod === "cash_on_delivery" &&

          orderStatus === "delivered" &&

          paymentStatus !== "paid" && (

            <button

              onClick={onRecordCashPayment}

              disabled={loading}

              className="
                w-full
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                py-3
                rounded-xl
                disabled:opacity-50
              "

            >
              Record Cash Payment

            </button>

          )
        }








        {
          checkoutMethod === "cash_on_delivery" &&

          orderStatus === "shipped" &&

          paymentStatus !== "paid" && (

            <button

              onClick={onOpenMpesaModal}

              disabled={loading}

              className="
                w-full
                bg-green-800
                hover:bg-green-900
                text-white
                py-3
                rounded-xl
                disabled:opacity-50
              "

            >
              Record M-Pesa Payment

            </button>

          )
        }








        {
          paymentStatus === "refund_pending" && (

            <button

              onClick={onOpenRefundModal}

              disabled={loading}

              className="
                w-full
                bg-red-600
                hover:bg-red-700
                text-white
                py-3
                rounded-xl
                disabled:opacity-50
              "

            >
              Complete Refund

            </button>

          )
        }








        {/* Cancel Order */}

        {
          [
            "pending",
            "confirmed",
            "processing"
          ].includes(orderStatus) && (

            <button

              onClick={onOpenCancelModal}

              disabled={loading}

              className="
                w-full
                bg-red-700
                hover:bg-red-800
                text-white
                py-3
                rounded-xl
                disabled:opacity-50
              "

            >
              Cancel Order

            </button>

          )
        }



      </div>

    </div>

  );

}