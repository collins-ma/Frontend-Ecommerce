import React from "react";

const PurchaseSummary = ({ summary }) => {

  return (

    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow
        p-6
        mb-8
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
          border-b
          pb-3
        "
      >
        Purchase Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="font-semibold">

            Items Purchased

          </span>

          <span>

            {summary.itemsCount}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="font-semibold">

            Total Quantity

          </span>

          <span>

            {summary.totalQuantity}

          </span>

        </div>

        <div
          className="
            flex
            justify-between
            border-t
            pt-4
          "
        >

          <span
            className="
              text-xl
              font-bold
            "
          >

            Grand Total

          </span>

          <span
            className="
              text-xl
              font-bold
              text-green-600
            "
          >

            KES {summary.grandTotal.toLocaleString()}

          </span>

        </div>

      </div>

    </div>

  );

};

export default PurchaseSummary;