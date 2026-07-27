import React, { useState } from "react";

export default function RequestReturnModal({
  isOpen,
  onClose,
  order,
  onConfirm,
  loading,
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  if (!isOpen) return null;

  const handleToggleItem = (item) => {
    const productId = item.product._id;

    setSelectedItems((prev) => {
      const exists = prev.find(
        (selected) => selected.product === productId
      );

      if (exists) {
        return prev.filter(
          (selected) => selected.product !== productId
        );
      }

      return [
        ...prev,
        {
          product: productId,
          quantity: 1,
          reason: "",
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((selected) =>
        selected.product === productId
          ? {
              ...selected,
              quantity,
            }
          : selected
      )
    );
  };

  const updateReason = (productId, reason) => {
    setSelectedItems((prev) =>
      prev.map((selected) =>
        selected.product === productId
          ? {
              ...selected,
              reason,
            }
          : selected
      )
    );
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const invalid = selectedItems.find(
      (item) => !item.reason
    );

    if (invalid) {
      alert("Please select a reason for every selected product.");
      return;
    }

      


    onConfirm(selectedItems);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6">
          Request Return
        </h2>

        <div className="space-y-5">

          {order.items.map((item) => {

            const selected = selectedItems.find(
              (selectedItem) =>
                selectedItem.product === item.product._id
            );

            return (
              <div
                key={item.product._id}
                className="border rounded-lg p-4"
              >
                <div className="flex gap-4">

                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => handleToggleItem(item)}
                    className="mt-6"
                  />

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold text-lg">
                      {item.product.name}
                    </h3>

                    <p>
                      Purchased: {item.quantity}
                    </p>

                    <p>
                      Price: KSh {item.product.priceKsh}
                    </p>

                    {selected && (
                      <>

                        <div className="mt-4">

                          <label className="font-medium block mb-2">
                            Quantity
                          </label>

                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              className="bg-gray-200 w-8 h-8 rounded"
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  Math.max(
                                    1,
                                    selected.quantity - 1
                                  )
                                )
                              }
                            >
                              -
                            </button>

                            <span>{selected.quantity}</span>

                            <button
                              type="button"
                              className="bg-gray-200 w-8 h-8 rounded"
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  Math.min(
                                    item.quantity,
                                    selected.quantity + 1
                                  )
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                        <div className="mt-4">

                          <label className="font-medium block mb-2">
                            Reason
                          </label>

                          <select
                            className="border rounded-lg w-full p-2"
                            value={selected.reason}
                            onChange={(e) =>
                              updateReason(
                                item.product._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="">
                              Select reason
                            </option>

                            <option value="Defective item">
                              Defective item
                            </option>

                            <option value="Wrong item received">
                              Wrong item received
                            </option>

                            <option value="Damaged during delivery">
                              Damaged during delivery
                            </option>

                            <option value="Missing parts or accessories">
                              Missing parts or accessories
                            </option>

                            <option value="Item not as described">
                              Item not as described
                            </option>

                            <option value="Changed my mind">
                              Changed my mind
                            </option>

                            <option value="Wrong size">
                              Wrong size
                            </option>

                            <option value="Other">
                              Other
                            </option>

                          </select>

                        </div>

                      </>
                    )}

                  </div>

                </div>

              </div>
            );

          })}

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Return"}
          </button>

        </div>

      </div>

    </div>
  );
}