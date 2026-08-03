import React from "react";

const PurchaseInfo = ({ purchase }) => {

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
        Purchase Details
      </h2>

      <div className="space-y-4">

        <div className="flex">

          <span className="w-52 font-semibold">
            Purchase Number
          </span>

          <span>
            {purchase.purchaseNumber}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Status
          </span>

          <span
            className={
              purchase.status === "Received"
                ? "text-green-600 font-semibold"
                : "text-yellow-600 font-semibold"
            }
          >
            {purchase.status}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Created By
          </span>

          <span>
            {purchase.createdBy.username}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Purchase Date
          </span>

          <span>
            {new Date(
              purchase.createdAt
            ).toLocaleString()}
          </span>

        </div>

        <div className="flex">

          <span className="w-52 font-semibold">
            Notes
          </span>

          <span>

            {
              purchase.notes ||
              "No notes"
            }

          </span>

        </div>

      </div>

    </div>

  );

};

export default PurchaseInfo;