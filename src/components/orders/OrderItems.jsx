import { FiPackage } from "react-icons/fi";
import React from "react";
export default function OrderItems({ items }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Order Items
      </h2>

      <div className="space-y-5">

        {items?.map((item) => (
          <div
            key={item.product?._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b dark:border-gray-700 pb-5"
          >
            {/* Product Information */}

            <div className="flex items-center gap-4">

              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-20 h-20 rounded-xl object-cover border"
              />

              <div>

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.product?.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Quantity: {item.quantity}
                </p>

                <p className="text-gray-500 text-sm">
                  KSh {item.priceksh.toLocaleString()} each
                </p>

              </div>

            </div>

            {/* Total */}

            <div className="text-right">

              <p className="text-sm text-gray-500">
                Item Total
              </p>

              <p className="font-bold text-lg text-blue-600">
                KSh {(item.quantity * item.priceksh).toLocaleString()}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center mt-6">

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">

          <FiPackage />

          <span>
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>

        </div>

        <div className="font-semibold text-gray-800 dark:text-white">

          Total Quantity:{" "}
          {items.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}

        </div>

      </div>

    </div>
  );
}