import React from "react";
import { useParams } from "react-router-dom";
import { useGetReturnByIdQuery } from "../features/returns/returnsApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function ReturnDetails() {
  useDocumentTitle("Return Details");

  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useGetReturnByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PulseLoader color="#2563EB" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">
          Failed to load return.
        </p>
      </div>
    );
  }

  const returnRequest = data.return;

  const order = returnRequest.order;


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

        <h1 className="text-3xl font-bold dark:text-white mb-6">
          Return Details
        </h1>

      <div className="flex justify-between items-start mb-8">

  <div>

    <h1 className="text-3xl font-bold dark:text-white">
      Return #{returnRequest._id.slice(-6).toUpperCase()}
    </h1>

    <p className="text-gray-500 mt-2">
      Requested on{" "}
      {new Date(
        returnRequest.createdAt
      ).toLocaleDateString()}
    </p>

  </div>

  <ReturnStatusBadge
    status={returnRequest.status}
  />


<div
  className="
    bg-gray-50
    dark:bg-gray-900
    rounded-2xl
    p-6
    mb-8
  "
>

  <h2
    className="
      text-xl
      font-bold
      mb-5
      dark:text-white
    "
  >
    Order Summary
  </h2>

  <div
    className="
      grid
      grid-cols-1
      md:grid-cols-2
      gap-6
    "
  >

    <InfoRow
      label="Order Number"
      value={`#${order._id.slice(-8).toUpperCase()}`}
    />

    <InfoRow
      label="Order Status"
      value={order.orderStatus}
    />

    <InfoRow
      label="Payment Status"
      value={order.paymentStatus.replaceAll("_"," ")}
    />

    <InfoRow
      label="Checkout Method"
      value={order.checkoutMethod}
    />

    <InfoRow
      label="Order Date"
      value={new Date(order.createdAt).toLocaleDateString()}
    />

    <InfoRow
      label="Total"
      value={`KSh ${order.total.toLocaleString()}`}
    />

  </div>


<div
  className="
    bg-white
    dark:bg-gray-800
    rounded-2xl
    shadow
    p-6
    mb-8
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
    Products
  </h2>

  <div className="space-y-5">
    {order.items.map((item) => (
      <div
        key={item._id}
        className="
          flex
          items-center
          gap-5
          border-b
          dark:border-gray-700
          pb-5
          last:border-none
          last:pb-0
        "
      >
        <img
          src={item.product?.image}
          alt={item.product?.name}
          className="
            w-20
            h-20
            rounded-xl
            object-cover
            border
          "
        />

        <div className="flex-1">

          <h3
            className="
              font-semibold
              dark:text-white
            "
          >
            {item.product?.name}
          </h3>

          <p className="text-gray-500 mt-1">
            Quantity: {item.quantity}
          </p>

     <p className="text-green-600 font-semibold mt-1">
  KSh {(item.product?.priceKsh ?? 0).toLocaleString()}
</p>

        </div>

      </div>
    ))}
  </div>
  <div
  className="
    bg-white
    dark:bg-gray-800
    rounded-2xl
    shadow
    p-6
    mb-8
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
    Return Information
  </h2>

  <div className="space-y-5">

    {/* Customer Reason */}

    <InfoRow
      label="Return Reason"
      value={returnRequest.reason}
    />

    {/* Admin Notes */}

    {returnRequest.adminNotes && (

      <InfoRow
        label="Admin Notes"
        value={returnRequest.adminNotes}
      />

    )}

    {/* Rejection Reason */}

    {returnRequest.rejectedReason && (

      <InfoRow
        label="Rejection Reason"
        value={returnRequest.rejectedReason}
      />

    )}

    {/* Refund Channel */}

    {returnRequest.refundChannel && (

      <InfoRow
        label="Refund Method"
        value={returnRequest.refundChannel}
      />

    )}

    {/* Refund Transaction */}

    {returnRequest.refundTransactionId && (

      <InfoRow
        label="Refund Transaction"
        value={returnRequest.refundTransactionId}
      />

    )}

  </div>

</div>
</div>
</div>
</div>

      </div>
    </div>
  );
}


function ReturnStatusBadge({ status }) {

  const colors = {

    requested:
      "bg-yellow-100 text-yellow-700",

    approved:
      "bg-blue-100 text-blue-700",

    item_received:
      "bg-purple-100 text-purple-700",

    refunded:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

  };

  return (

    <span
      className={`
        px-4
        py-2
        rounded-full
        font-semibold
        capitalize
        ${colors[status]}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>

  );

}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold dark:text-white">
        {value}
      </p>
    </div>
  );
}