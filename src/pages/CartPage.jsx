import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGetCartQuery, useRemoveFromCartMutation } from "../features/cart/cartApiSlice";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function CartPage() {
  useDocumentTitle('cartPage')
 
  const navigate = useNavigate();

 
  const { data: cart, isLoading, isError, error } = useGetCartQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

 
  const [removeFromCart, { error: removeError }] = useRemoveFromCartMutation();
  const [removingItemId, setRemovingItemId] = useState(null);

  const calculateTotal = () =>
    cart?.items
      .filter((item) => item.product)
      .reduce((acc, item) => acc + item.product.priceKsh * item.quantity, 0) || 0;


  const handleRemoveItem = async (productId) => {
    setRemovingItemId(productId);
    try {
      await removeFromCart(productId).unwrap();
    } catch (err) {
    } finally {
      setRemovingItemId(null);
    }
  };

  
  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-300 text-lg">Loading cart...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 text-lg">{error?.data?.message || "Failed to load cart"}</p>
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300 text-lg">Your cart is empty!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
    

      
      {removeError?.data?.message && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {removeError.data.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {cart.items.map((item) =>
            item.product ? (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between py-3 sm:py-4"
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={item.product.image || "/placeholder.png"}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      KSH {item.product.priceKsh}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  disabled={removingItemId === item.product._id}
                  className="mt-3 sm:mt-0 ml-0 sm:ml-3 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {removingItemId === item.product._id ? (
                    <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiTrash2 className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300" size={20} />
                  )}
                </button>
              </div>
            ) : null
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Total</h2>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2 sm:mt-0">
            KSH {calculateTotal()}
          </p>
        </div>

        
        <button
          onClick={handleProceedToCheckout}
          className="mt-6 w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}