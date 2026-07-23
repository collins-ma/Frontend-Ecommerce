import React, { useState } from "react";

export default function RefundModal({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) {
  const [refundChannel, setRefundChannel] = useState("cash");
  const [transactionId, setTransactionId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm({
      refundChannel,
      transactionId,
    });

    setTransactionId("");
    setRefundChannel("cash");
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          dark:bg-gray-800
          rounded-2xl
          p-6
          w-[90%]
          max-w-md
        "
      >
        <h2
          className="
            text-xl
            font-bold
            mb-5
            dark:text-white
          "
        >
          Complete Refund
        </h2>

        <label
          className="
            block
            mb-2
            dark:text-white
          "
        >
          Refund Channel
        </label>

        <select
          value={refundChannel}
          onChange={(e) =>
            setRefundChannel(e.target.value)
          }
          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            bg-white
            dark:bg-gray-700
            dark:text-white
          "
        >
          <option value="cash">
            Cash
          </option>

          <option value="mpesa">
            M-Pesa
          </option>
        </select>

        {refundChannel === "mpesa" && (
          <input
            type="text"
            placeholder="Refund Transaction ID"
            value={transactionId}
            onChange={(e) =>
              setTransactionId(e.target.value)
            }
            className="
              mt-4
              w-full
              border
              rounded-xl
              px-4
              py-3
              bg-white
              dark:bg-gray-700
              dark:text-white
            "
          />
        )}

        <div
          className="
            flex
            justify-end
            gap-3
            mt-6
          "
        >
          <button
            onClick={onClose}
            className="
              px-5
              py-2
              rounded-xl
              bg-gray-300
              hover:bg-gray-400
            "
          >
            Cancel
          </button>

          <button
            disabled={
              loading ||
              (refundChannel === "mpesa" &&
                !transactionId.trim())
            }
            onClick={handleSubmit}
            className="
              px-5
              py-2
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              disabled:opacity-50
            "
          >
            {loading
              ? "Processing..."
              : "Complete Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}