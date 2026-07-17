import React, { useState, useEffect } from "react";
import { useInitiatePaymentMutation } from "../features/payment/paymentApiSlice";
import { useGetOrderStatusQuery } from "../features/orders/ordersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function CheckoutPage() {
  useDocumentTitle('checkout')
  const { username } = useAuth();
  const navigate = useNavigate();

  const [initiatePayment, { isLoading: isPaying, error: paymentError }] =
    useInitiatePaymentMutation();

  const [shippingName, setShippingName] = useState(username || "");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (username) setShippingName(username);
  }, [username]);

  // Poll order status
  const { data: orderStatusData } = useGetOrderStatusQuery(currentOrderId, {
    skip: !currentOrderId,
    pollingInterval: 4000,
  });

  useEffect(() => {
    if (orderStatusData?.status) {
      setOrderStatus(orderStatusData.status);
    }
  }, [orderStatusData]);

  // Redirect after payment success
  useEffect(() => {
    if (orderStatus === "paid") {
      setTimeout(() => navigate("/products"), 2000);
    }
  }, [orderStatus, navigate]);

  const handlePayment = async () => {
   if (
    !shippingStreet ||
    !shippingCity ||
    !shippingZip
) {
    return;
}

if (paymentMethod === "mpesa" && !phoneNumber) {
    return;
}

    try {
      
      const response = await initiatePayment({
    paymentMethod,
    phoneNumber:
        paymentMethod === "mpesa"
            ? phoneNumber
            : undefined,

    shippingAddress: {
        name: shippingName,
        street: shippingStreet,
        city: shippingCity,
        zip: shippingZip,
        phone:
            paymentMethod === "mpesa"
                ? phoneNumber
                : "",
    },
}).unwrap();
      if (response.method === "mpesa") {
  setCurrentOrderId(response.orderId);
  setOrderStatus("pending");
} else {
  setSuccessMessage(
    "Order placed successfully. You selected Cash on Delivery. Please pay when your order arrives."
  );

  setTimeout(() => {
    navigate("/my-orders");
  }, 3000);
}
    } catch (err) {
      setOrderStatus("failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Greeting */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Checkout
        </h1>

        {/* Payment error */}
        {paymentError?.data?.message && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200 rounded-lg text-center">
            {paymentError.data.message}
          </div>
        )}

        {/* Order status messages */}
        {orderStatus === "pending" && (
          <p className="mb-4 text-center text-blue-700 dark:text-blue-400 font-medium">
            Processing payment...
          </p>
        )}
        {orderStatus === "paid" && (
          <p className="mb-4 text-center text-green-700 dark:text-green-400 font-medium">
            Payment successful! Redirecting...
          </p>
        )}
        {orderStatus === "failed" && (
          <p className="mb-4 text-center text-red-700 dark:text-red-400 font-medium">
            Payment failed.
          </p>
        )}

        {/* Shipping form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={shippingName}
            readOnly
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Street"
            value={shippingStreet}
            onChange={(e) => setShippingStreet(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="City"
            value={shippingCity}
            onChange={(e) => setShippingCity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={shippingZip}
            onChange={(e) => setShippingZip(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />

           
           <div className="mt-4">
  <p className="mb-2 font-medium text-gray-700 dark:text-gray-200">
    Payment Method
  </p>

  <label className="flex items-center gap-2 mb-2 cursor-pointer">
    <input
      type="radio"
      value="mpesa"
      checked={paymentMethod === "mpesa"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>M-Pesa</span>
  </label>

  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      value="cash_on_delivery"
      checked={paymentMethod === "cash_on_delivery"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>Cash on Delivery</span>
  </label>
</div>
         {paymentMethod === "mpesa" && (
  <input
    type="tel"
    placeholder="Phone Number (+2547xxxxxxxx)"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
  />
)}
        </div>

        <button
          onClick={handlePayment}
          disabled={isPaying || orderStatus === "pending"}
          className="mt-6 w-full bg-green-600 dark:bg-green-500 text-white dark:text-gray-900 py-3 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition"
        >
        {isPaying || orderStatus === "pending"
    ? "Processing..."
    : paymentMethod === "mpesa"
    ? "Pay with M-Pesa"
    : "Place Order"}

        </button>
      </div>
    </div>
  );
}