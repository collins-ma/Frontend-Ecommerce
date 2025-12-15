import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGetCartQuery, useRemoveFromCartMutation } from "../features/cart/cartApiSlice";
import { useInitiatePaymentMutation } from "../features/payment/paymentApiSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function CartPage() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { data: cart, isLoading, isError, error } = useGetCartQuery(
    'cartList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }
  );
  const [removeFromCart] = useRemoveFromCartMutation();
  const [initiatePayment] = useInitiatePaymentMutation();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shippingName, setShippingName] = useState(username || "");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [removingItemId, setRemovingItemId] = useState(null);

  // Update shippingName if username loads asynchronously
  useEffect(() => {
    if (username) setShippingName(username);
  }, [username]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          {error?.data?.message || "Failed to load cart"}
        </p>
      </div>
    );

  if (!cart || cart.items.length === 0)
    return <p className="mt-1 text-black">Your cart is empty!</p>;

  const calculateTotal = () =>
    cart.items
      .reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0)
      .toFixed(2);

  const handlePayment = async () => {
    if (!shippingName || !shippingStreet || !shippingCity || !shippingZip) {
      toast.error("Please fill in all required shipping fields.", {
        style: { background: "#000", color: "#fff" },
      });
      return;
    }

    if (paymentMethod === "mpesa" && !phoneNumber) {
      toast.error("Please enter your phone number for M-Pesa.", {
        style: { background: "#000", color: "#fff" },
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await initiatePayment({
        method: paymentMethod,
        phoneNumber: paymentMethod === "mpesa" ? phoneNumber : undefined,
        email: paymentMethod === "stripe" ? "user@example.com" : undefined,
        shippingAddress: {
          name: shippingName,
          street: shippingStreet,
          city: shippingCity,
          zip: shippingZip,
          phone: paymentMethod === "mpesa" ? phoneNumber : undefined,
        },
      }).unwrap();

      // Navigate immediately after order creation
      navigate("/products");

      if (paymentMethod === "mpesa") {
        setMpesaMessage(
          "STK push sent to your phone, please enter your PIN to complete payment."
        );
      } else if (paymentMethod === "stripe") {
        window.location.href = response.paymentResponse.url;
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Payment failed", {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItemId(productId);
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Item removed from cart!", {
        style: { background: "#000", color: "#fff" },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item", {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div key={item._id} className="flex items-center py-3 justify-between">
              <div className="flex items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div className="ml-3 flex-1">
                  <h2 className="text-base font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-600 text-sm">${item.product.priceUSD}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveItem(item.product._id)}
                disabled={removingItemId === item.product._id}
                className="ml-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
              >
                {removingItemId === item.product._id ? (
                  <span className="text-gray-500 text-sm">...</span>
                ) : (
                  <FiTrash2 className="text-red-600 hover:text-red-800" size={20} />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800">Total</h2>
          <p className="text-xl font-bold text-gray-900">${calculateTotal()}</p>
        </div>

        <button
          className="mt-6 w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          onClick={() => setPaymentModalOpen(true)}
        >
          Checkout
        </button>
      </div>

      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping & Payment
            </h2>

            <input
           type="text"
            placeholder="Full Name"
            value={shippingName}
            readOnly
         className="w-full mb-2 border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Street"
              value={shippingStreet}
              onChange={(e) => setShippingStreet(e.target.value)}
              className="w-full mb-2 border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="City"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              className="w-full mb-2 border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={shippingZip}
              onChange={(e) => setShippingZip(e.target.value)}
              className="w-full mb-4 border rounded-lg px-3 py-2"
            />

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select a method</option>
                <option value="mpesa">M-Pesa</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            {paymentMethod === "mpesa" && (
              <input
                type="tel"
                placeholder="Phone Number (+2547xxxxxxx)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full mb-4 border rounded-lg px-3 py-2"
              />
            )}

            {mpesaMessage && (
              <p className="mb-4 text-green-700 font-medium">{mpesaMessage}</p>
            )}

            {!mpesaMessage && (
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg mb-3 font-medium hover:bg-green-700 transition"
              >
                {isProcessing ? "Processing..." : "Pay"}
              </button>
            )}

            <button
              onClick={() => {
                setPaymentModalOpen(false);
                setMpesaMessage("");
                setPhoneNumber("");
                setPaymentMethod("");
              }}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
