import React, { useState } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGetSuppliersQuery } from "../features/suppliersApiSlice";
import { useGetProductsAdminQuery } from "../features/products/productsApiSlice";
import { useCreatePurchaseMutation } from "../features/purchases/purchasesApiSlice";

const CreatePurchase = () => {
  useDocumentTitle("Create Purchase");

  const {
    data: suppliers,
    isLoading: isSupplierLoading,
  } = useGetSuppliersQuery();

  const {
    data: products,
    isLoading: isProductLoading,
  } = useGetProductsAdminQuery();

  const [
    createPurchase,
    {
      isLoading,
    },
  ] = useCreatePurchaseMutation();

  const [purchase, setPurchase] = useState({
    supplier: "",
    notes: "",
    items: [
      {
        product: "",
        quantity: 1,
        unitCost: 0,
      },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We'll complete this later
    console.log(purchase);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Create Purchase
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        dark:bg-gray-800
        rounded-2xl
        shadow
        p-6
        space-y-6
        "
      >

        {/* Supplier */}

        <div>

          <label className="block mb-2 font-medium">
            Supplier
          </label>

          {isSupplierLoading ? (

            <p>Loading suppliers...</p>

          ) : (

            <select
              value={purchase.supplier}
              onChange={(e) =>
                setPurchase((prev) => ({
                  ...prev,
                  supplier: e.target.value,
                }))
              }
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              "
            >

              <option value="">
                Select Supplier
              </option>

              {suppliers?.ids.map((id) => {

                const supplier =
                  suppliers.entities[id];

                return (
                  <option
                    key={supplier._id}
                    value={supplier._id}
                  >
                    {supplier.companyName}
                  </option>
                );

              })}

            </select>

          )}

        </div>

        {/* Notes */}

        <div>

          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            rows="4"
            value={purchase.notes}
            onChange={(e) =>
              setPurchase((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            "
            placeholder="Purchase notes..."
          />

        </div>

        {/* Products Placeholder */}

        <div
          className="
          border
          rounded-xl
          p-6
          bg-gray-50
          dark:bg-gray-700
          "
        >

          <h2 className="text-xl font-semibold mb-3">
            Products
          </h2>

          <p className="text-gray-500">
            Product selection will be added in the next step.
          </p>

        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-gray-400
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
          "
        >

          {isLoading
            ? "Saving..."
            : "Create Purchase"}

        </button>

      </form>

    </div>
  );
};

export default CreatePurchase;