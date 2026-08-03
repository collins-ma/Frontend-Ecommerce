import React from "react";

const PurchaseItemsTable = ({ items }) => {

  return (

    <div
      className="
        bg-white
        dark:bg-gray-800
        rounded-xl
        shadow
        overflow-hidden
        mb-8
      "
    >

      <div className="p-6 border-b">

        <h2 className="text-2xl font-bold">
          Products Purchased
        </h2>

      </div>

      <table className="w-full">

        <thead
          className="
            bg-gray-100
            dark:bg-gray-700
          "
        >

          <tr>

            <th className="text-left px-4 py-3">
              Image
            </th>

            <th className="text-left px-4 py-3">
              Product
            </th>

            <th className="text-left px-4 py-3">
              Category
            </th>

            <th className="text-center px-4 py-3">
              Qty
            </th>

            <th className="text-right px-4 py-3">
              Unit Cost
            </th>

            <th className="text-right px-4 py-3">
              Line Total
            </th>

            <th className="text-center px-4 py-3">
              Current Stock
            </th>

          </tr>

        </thead>

        <tbody>

          {

            items.length === 0

            ?

            (

              <tr>

                <td
                  colSpan="7"
                  className="
                    text-center
                    py-8
                  "
                >

                  No products found.

                </td>

              </tr>

            )

            :

            items.map((item) => (

              <tr
                key={item._id}
                className="
                  border-t
                  hover:bg-gray-50
                  dark:hover:bg-gray-700
                "
              >

                <td className="px-4 py-3">

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="
                      w-16
                      h-16
                      rounded-lg
                      object-cover
                    "
                  />

                </td>

                <td className="px-4 py-3 font-medium">

                  {item.product.name}

                </td>

                <td className="px-4 py-3">

                  {item.product.category?.name}

                </td>

                <td className="px-4 py-3 text-center">

                  {item.quantity}

                </td>

                <td className="px-4 py-3 text-right">

                  KES {item.unitCost.toLocaleString()}

                </td>

                <td
                  className="
                    px-4
                    py-3
                    text-right
                    font-semibold
                  "
                >

                  KES {item.lineTotal.toLocaleString()}

                </td>

                <td className="px-4 py-3 text-center">

                  {item.product.stock}

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </div>

  );

};

export default PurchaseItemsTable;