import React, { useState } from "react";


export default function RequestReturnModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {

  const [reason, setReason] = useState("");


  const reasons = [
    "Damaged product",
    "Wrong product delivered",
    "Product not as described",
    "Changed my mind",
    "Quality issue",
    "Other",
  ];



  if (!isOpen) return null;



  const handleSubmit = () => {

    if (!reason) return;


    onConfirm({
      reason,
    });


    setReason("");

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
            dark:text-white
            mb-3
          "
        >
          Request Return
        </h2>



        <p
          className="
            text-gray-600
            dark:text-gray-300
            mb-4
          "
        >
          Tell us why you want to return this order.
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
            "

          >

            Cancel

          </button>



          <button

            disabled={!reason || loading}

            onClick={handleSubmit}

            className="
              px-4
              py-2
              rounded-xl
              bg-blue-600
              text-white
              disabled:opacity-50
            "

          >

            {
              loading
              ?
              "Submitting..."
              :
              "Submit Request"
            }


          </button>



        </div>



      </div>


    </div>

  );

}