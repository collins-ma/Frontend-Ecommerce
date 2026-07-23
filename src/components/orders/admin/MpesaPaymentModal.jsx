import React, { useState } from "react";

export default function MpesaPaymentModal({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) {
  const [transactionId, setTransactionId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!transactionId.trim()) return;

    onConfirm(transactionId);

    setTransactionId("");
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
          Record M-Pesa Payment
        </h2>

        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            dark:bg-gray-700
            dark:text-white
          "
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="
              px-5
              py-2
              rounded-xl
              bg-gray-300
            "
          >
            Cancel
          </button>

          <button
            disabled={
              !transactionId ||
              loading
            }
            onClick={handleSubmit}
            className="
              px-5
              py-2
              rounded-xl
              bg-green-700
              text-white
              disabled:opacity-50
            "
          >
            {loading
              ? "Saving..."
              : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}