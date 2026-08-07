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
    { isLoading },
  ] = useCreatePurchaseMutation();

  const [purchase, setPurchase] = useState({
    supplier: "",
    notes: "",
    items: [
      {
        product: "",
        quantity: 1,
        unitCost: 0,
        expiryDate: "",
      },
    ],
  });

console.log(products?.entities);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPurchase(purchase).unwrap();

      alert("Purchase created successfully.");

      setPurchase({
        supplier: "",
        notes: "",
        items: [
          {
            product: "",
            quantity: 1,
            unitCost: 0,
            expiryDate: "",
          },
        ],
      });

    } catch (err) {
      alert(
        err?.data?.message ||
          "Failed to create purchase."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

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
              required
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
            rows={4}
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
          />

        </div>

        {/* Header */}

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            Products
          </h2>

          <button
            type="button"
            onClick={() =>
              setPurchase((prev) => ({
                ...prev,
                items: [
                  ...prev.items,
                  {
                    product: "",
                    quantity: 1,
                    unitCost: 0,
                    expiryDate: "",
                  },
                ],
              }))
            }
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            + Add Product
          </button>

        </div>

        {purchase.items.map((item, index) => {

          const selectedProduct =
            item.product
              ? products?.entities[item.product]
              : null;

          const requiresExpiry =
            selectedProduct?.category?.trackExpiry;

          return (

            <div
              key={index}
              className="
                grid
                grid-cols-12
                gap-4
                items-end
              "
            >

              {/* Product */}

              <div className="col-span-4">

                <label className="block mb-2">
                  Product
                </label>

                {isProductLoading ? (

                  <p>Loading...</p>

                ) : (

                  <select
                    required
                    value={item.product}
                    onChange={(e) => {

                      const newItems =
                        [...purchase.items];

                      newItems[index].product =
                        e.target.value;

                      const product =
                        products?.entities[
                          e.target.value
                        ];

                      if (
                        !product?.category
                          ?.trackExpiry
                      ) {
                        newItems[index].expiryDate =
                          "";
                      }

                      setPurchase({
                        ...purchase,
                        items: newItems,
                      });

                    }}
                    className="
                      w-full
                      border
                      rounded-lg
                      px-3
                      py-2
                    "
                  >

                    <option value="">
                      Select Product
                    </option>

                    {products?.ids.map((id) => {

                      const product =
                        products.entities[id];

                      return (

                        <option
                          key={product._id}
                          value={product._id}
                        >
                          {product.name}
                        </option>

                      );

                    })}

                  </select>

                )}

              </div>

              {/* Qty */}

              <div className="col-span-2">

                <label className="block mb-2">
                  Qty
                </label>

                <input
                  required
                  min={1}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {

                    const newItems =
                      [...purchase.items];

                    newItems[index].quantity =
                      Number(e.target.value);

                    setPurchase({
                      ...purchase,
                      items: newItems,
                    });

                  }}
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2
                  "
                />

              </div>

              {/* Cost */}

              <div className="col-span-2">

                <label className="block mb-2">
                  Unit Cost
                </label>

                <input
                  required
                  min={0}
                  type="number"
                  value={item.unitCost}
                  onChange={(e) => {

                    const newItems =
                      [...purchase.items];

                    newItems[index].unitCost =
                      Number(e.target.value);

                    setPurchase({
                      ...purchase,
                      items: newItems,
                    });

                  }}
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2
                  "
                />

              </div>

              {/* Expiry */}

              <div className="col-span-2">

                {requiresExpiry && (

                  <>
                    <label className="block mb-2">
                      Expiry Date
                    </label>

                    <input
                      type="date"
                      required={requiresExpiry}
                      value={item.expiryDate}
                      onChange={(e) => {

                        const newItems =
                          [...purchase.items];

                        newItems[index].expiryDate =
                          e.target.value;

                        setPurchase({
                          ...purchase,
                          items: newItems,
                        });

                      }}
                      className="
                        w-full
                        border
                        rounded-lg
                        px-3
                        py-2
                      "
                    />
                  </>

                )}

              </div>

              {/* Remove */}

              <div className="col-span-2">

                {purchase.items.length > 1 && (

                  <button
                    type="button"
                    onClick={() => {

                      const newItems =
                        purchase.items.filter(
                          (_, i) =>
                            i !== index
                        );

                      setPurchase({
                        ...purchase,
                        items: newItems,
                      });

                    }}
                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Remove
                  </button>

                )}

              </div>

            </div>

          );

        })}

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