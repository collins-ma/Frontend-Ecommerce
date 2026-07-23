import React, { useState } from "react";


export default function AdminCancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {


  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");



  const reasons = [

    "Product out of stock",

    "Supplier unavailable",

    "Payment verification failed",

    "Suspicious or fraudulent order",

    "Customer unreachable",

    "Delivery unavailable in location",

    "Duplicate order",

    "Other",

  ];



  if (!isOpen) return null;




  const handleConfirm = () => {

    if (!reason) return;


    onConfirm({
      reason,
      note,
    });


    setReason("");
    setNote("");

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
            mb-3
            dark:text-white
          "
        >
          Cancel Order (Admin)
        </h2>



        <p
          className="
            text-gray-600
            dark:text-gray-300
            mb-4
          "
        >
          Select why this order is being cancelled.
        </p>





        <select

          value={reason}

          onChange={(e)=>
            setReason(e.target.value)
          }

          className="
            w-full
            border
            rounded-xl
            p-3
            dark:bg-gray-700
            dark:text-white
          "

        >

          <option value="">
            Select cancellation reason
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






        <textarea

          value={note}

          onChange={(e)=>
            setNote(e.target.value)
          }

          placeholder="Additional notes (optional)"

          className="
            mt-4
            w-full
            border
            rounded-xl
            p-3
            dark:bg-gray-700
            dark:text-white
          "

        />







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
            "

          >

            Back

          </button>






          <button

            onClick={handleConfirm}

            disabled={!reason || loading}

            className="
              px-4
              py-2
              rounded-xl
              bg-red-600
              text-white
              disabled:opacity-50
            "

          >

            {
              loading
              ?
              "Cancelling..."
              :
              "Cancel Order"
            }


          </button>



        </div>



      </div>


    </div>

  );

}