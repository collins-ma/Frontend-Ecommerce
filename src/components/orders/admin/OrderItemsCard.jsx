import React from "react";

export default function OrderItemsCard({ items = [] }) {
  return (
    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow
        border
        dark:border-gray-700
        p-6
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-6
          text-gray-900
          dark:text-white
        "
      >
        Ordered Items
      </h2>

      <div className="space-y-5">
        {items.map((item) => {
          const price =
            item.priceKsh ??
            item.priceksh ??
            item.product?.priceKsh ??
            0;

          return (
            <div
              key={item._id || item.product?._id}
              className="
                flex
                gap-5
                items-center
                border-b
                dark:border-gray-700
                pb-5
              "
            >
              {/* Product Image */}
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="
                  w-24
                  h-24
                  rounded-xl
                  object-cover
                  border
                "
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3
                  className="
                    font-semibold
                    text-lg
                    dark:text-white
                  "
                >
                  {item.product?.name}
                </h3>

                <p
                  className="
                    text-gray-500
                    text-sm
                    mt-1
                  "
                >
                  Quantity
                </p>

                <p
                  className="
                    font-medium
                    dark:text-gray-200
                  "
                >
                  {item.quantity}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p
                  className="
                    text-gray-500
                    text-sm
                  "
                >
                  Unit Price
                </p>

                <p
                  className="
                    font-semibold
                    dark:text-white
                  "
                >
                  KSh {price.toLocaleString()}
                </p>

                <p
                  className="
                    mt-3
                    text-gray-500
                    text-sm
                  "
                >
                  Total
                </p>

                <p
                  className="
                    text-green-600
                    font-bold
                    text-lg
                  "
                >
                  KSh {(item.quantity * price).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}