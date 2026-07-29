import React from "react";
import { Link } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";

import { useGetPurchasesQuery } from "../features/purchases/purchasesApiSlice";

const PurchasesPage = () => {

  useDocumentTitle("Purchases");

  const {
    data: purchases,
    isLoading,
    isError,
    error,
  } = useGetPurchasesQuery();

  if (isLoading) {

    return (
      <div className="p-6">
        Loading purchases...
      </div>
    );

  }

  if (isError) {

    return (
      <div className="p-6 text-red-600">

        {
          error?.data?.message ||
          "Failed to load purchases"
        }

      </div>
    );

  }

  const purchaseIds = purchases?.ids ?? [];

  return (

    <div className="max-w-7xl mx-auto p-6">

      <div
        className="
        flex
        justify-between
        items-center
        mb-6
        "
      >

        <h1
          className="
          text-3xl
          font-bold
          "
        >
          Purchases
        </h1>

        <Link
          to="/admin/purchases/new"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-2
          rounded-lg
          font-medium
          "
        >
          + New Purchase
        </Link>

      </div>

      <div
        className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
            bg-gray-100
            dark:bg-gray-700
            "
          >

            <tr>

              <th className="text-left px-4 py-3">
                Purchase No
              </th>

              <th className="text-left px-4 py-3">
                Supplier
              </th>

              <th className="text-left px-4 py-3">
                Status
              </th>

              <th className="text-left px-4 py-3">
                Created By
              </th>

              <th className="text-left px-4 py-3">
                Date
              </th>

              <th className="text-center px-4 py-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {

              purchaseIds.length === 0

              ?

              (

                <tr>

                  <td
                    colSpan="6"
                    className="
                    text-center
                    py-8
                    "
                  >

                    No purchases found.

                  </td>

                </tr>

              )

              :

              purchaseIds.map((purchaseId) => {

                const purchase =
                  purchases.entities[purchaseId];

                return (

                  <tr
                    key={purchase._id}
                    className="
                    border-t
                    hover:bg-gray-50
                    dark:hover:bg-gray-700
                    "
                  >

                    <td className="px-4 py-3">

                      {purchase.purchaseNumber}

                    </td>

                    <td className="px-4 py-3">

                      {purchase.supplier?.companyName}

                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={
                          purchase.status === "Received"

                            ?

                            "text-green-600 font-semibold"

                            :

                            "text-yellow-600 font-semibold"
                        }
                      >

                        {purchase.status}

                      </span>

                    </td>

                    <td className="px-4 py-3">

                      {purchase.createdBy?.username}

                    </td>

                    <td className="px-4 py-3">

                      {
                        new Date(
                          purchase.createdAt
                        ).toLocaleDateString()
                      }

                    </td>

                    <td
                      className="
                      px-4
                      py-3
                      text-center
                      "
                    >

                      <Link
                        to={`/purchases/${purchase._id}`}
                        className="
                        text-blue-600
                        hover:underline
                        "
                      >
                        View
                      </Link>

                    </td>

                  </tr>

                );

              })

            }

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default PurchasesPage;