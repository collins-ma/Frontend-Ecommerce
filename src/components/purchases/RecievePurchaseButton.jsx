import React from "react";
import { useReceivePurchaseMutation } from "../../features/purchases/purchasesApiSlice";
const ReceivePurchaseButton = ({
  purchaseId,
  status,
}) => {

  const [
    receivePurchase,
    {
      isLoading,
    },
  ] = useReceivePurchaseMutation();

  const handleReceive = async () => {

    try {

      await receivePurchase(
        purchaseId
      ).unwrap();

      alert(
        "Purchase received successfully."
      );

    } catch (err) {

      alert(

        err?.data?.message ||

        "Failed to receive purchase."

      );

    }

  };

  if (status === "Received") {

    return (

      <div className="mt-8 text-center">

        <div
          className="
            inline-flex
            items-center
            bg-green-100
            text-green-700
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >

          ✔ Goods Received

        </div>

      </div>

    );

  }

  return (

    <div className="mt-8 text-center">

      <button
        onClick={handleReceive}
        disabled={isLoading}
        className="
          bg-green-600
          hover:bg-green-700
          disabled:bg-gray-400
          text-white
          px-8
          py-3
          rounded-xl
          font-semibold
        "
      >

        {

          isLoading

          ?

          "Receiving..."

          :

          "✔ Receive Goods"

        }

      </button>

    </div>

  );

};

export default ReceivePurchaseButton;