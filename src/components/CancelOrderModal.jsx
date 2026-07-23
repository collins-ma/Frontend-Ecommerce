import React, { useState } from "react";

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  const [reason, setReason] = useState("");

  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a cheaper product elsewhere",
    "Delivery is taking too long",
    "Wrong product selected",
    "Other",
  ];


  if (!isOpen) return null;


  const handleConfirm = () => {
    if (!reason) return;

    onConfirm(reason);

    setReason("");
  };


  return (
    <div
      className="
        fixed inset-0
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
          shadow-xl
          p-6
          w-[90%]
          max-w-md
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-gray-900
            dark:text-white
            mb-3
          "
        >
          Cancel Order
        </h2>


        <p
          className="
            text-gray-600
            dark:text-gray-300
            mb-4
          "
        >
          Select a reason for cancelling this order.
        </p>



        <select

          value={reason}

          onChange={(e)=>setReason(e.target.value)}

          className="
            w-full
            border
            rounded-xl
            p-3
            bg-white
            dark:bg-gray-700
            dark:text-white
          "

        >

          <option value="">
            Select reason
          </option>


          {
            reasons.map((item)=>(
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))
          }


        </select>



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
              px-4
              py-2
              rounded-xl
              bg-gray-300
              hover:bg-gray-400
            "

          >
            Back
          </button>



          <button

            disabled={!reason || loading}

            onClick={handleConfirm}

            className="
              px-4
              py-2
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              disabled:opacity-50
            "

          >

            {
              loading
              ?
              "Cancelling..."
              :
              "Confirm Cancel"
            }

          </button>


        </div>


      </div>


    </div>
  );
}