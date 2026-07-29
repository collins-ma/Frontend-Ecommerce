import React from "react";
import { useParams } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";

import {
  useGetPurchaseByIdQuery,
  useReceivePurchaseMutation,
} from "../features/purchases/purchasesApiSlice";

const PurchaseDetails = () => {
  useDocumentTitle("Purchase Details");

  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetPurchaseByIdQuery(id);

  const [
    receivePurchase,
    {
      isLoading: isReceiving,
    },
  ] = useReceivePurchaseMutation();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading purchase...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        {error?.data?.message || "Failed to load purchase"}
      </div>
    );
  }

  const purchase = data.purchase;
  const items = data.items;

  const handleReceive = async () => {
    try {
      await receivePurchase(id).unwrap();

      alert("Purchase received successfully.");
    } catch (err) {
      alert(
        err?.data?.message ||
          "Failed to receive purchase."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Purchase Details
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="font-semibold">
              Purchase Number
            </p>

            <p>{purchase.purchaseNumber}</p>
          </div>

          <div>
            <p className="font-semibold">
              Supplier
            </p>

            <p>
              {purchase.supplier.companyName}
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Created By
            </p>

            <p>
              {purchase.createdBy.username}
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Status
            </p>

            <p>{purchase.status}</p>
          </div>

          <div>
            <p className="font-semibold">
              Notes
            </p>

            <p>{purchase.notes}</p>
          </div>

          <div>
            <p className="font-semibold">
              Date
            </p>

            <p>
              {new Date(
                purchase.createdAt
              ).toLocaleString()}
            </p>
          </div>

        </div>

      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 dark:bg-gray-700">

            <tr>

              <th className="text-left px-4 py-3">
                Product
              </th>

              <th className="text-left px-4 py-3">
                Quantity
              </th>

              <th className="text-left px-4 py-3">
                Unit Cost
              </th>

              <th className="text-left px-4 py-3">
                Current Stock
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item) => (

              <tr
                key={item._id}
                className="border-t"
              >

                <td className="px-4 py-3">

                  {item.product.name}

                </td>

                <td className="px-4 py-3">

                  {item.quantity}

                </td>

                <td className="px-4 py-3">

                  KES {item.unitCost.toLocaleString()}

                </td>

                <td className="px-4 py-3">

                  {item.product.stock}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {purchase.status === "Pending" && (

        <div className="mt-8">

          <button
            onClick={handleReceive}
            disabled={isReceiving}
            className="
            bg-green-600
            hover:bg-green-700
            disabled:bg-gray-400
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            "
          >
            {isReceiving
              ? "Receiving..."
              : "Receive Goods"}
          </button>

        </div>

      )}

    </div>
  );
};

export default PurchaseDetails;