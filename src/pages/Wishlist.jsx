import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { useState } from "react";
import React from "react";



import { useGetMyWishlistQuery,useRemoveFromWishlistMutation,useEmptyWishlistMutation } from "../features/wishlist/wishlistApiSlice";


import { useAddToCartMutation } from "../features/cart/cartApiSlice";

import useDocumentTitle from "../hooks/useDocumentTitle";

const Wishlist = () => {
    
    const [processingId, setProcessingId] = useState(null);



  useDocumentTitle("Wishlist");

  const {
    data: wishlistData,
    isLoading,
    isError,
    error,
  } = useGetMyWishlistQuery();

  const [removeFromWishlist] =
    useRemoveFromWishlistMutation();

  const [addToCart] =
    useAddToCartMutation();

const [emptyWishlist] =
useEmptyWishlistMutation();


const handleEmptyWishlist = async () => {

    const confirmed = window.confirm(
        "Remove all products from your wishlist?"
    );

    if (!confirmed) return;

    try {

        await emptyWishlist().unwrap();

    } catch (err) {

        console.log(err);

    }

};


    if (isError) {
  return (
    <div className="text-center mt-20">

      <p className="text-red-500 text-lg">
        {error?.data?.message ||
          "Failed to load wishlist"}
      </p>

    </div>
  );
}


const wishlistProducts =
  wishlistData?.ids.map(
    id => wishlistData.entities[id]
  ) || [];

if (!wishlistProducts.length) {

  return (

    <div className="min-h-screen flex flex-col justify-center items-center">

      <Heart
        size={70}
        className="text-red-500"
      />

      <h1 className="text-3xl font-bold mt-5">
        Your wishlist is empty
      </h1>

      <p className="text-gray-500 mt-3">
        Save products you love to buy later.
      </p>

      <Link
        to="/products"
        className="
        mt-6
        bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-green-700
        "
      >
        Continue Shopping
      </Link>

    </div>

  );

}
const handleRemove = async (productId) => {
  try {
    setProcessingId(productId);

    await removeFromWishlist(productId).unwrap();

  } catch (err) {
    console.log(err);
  } finally {
    setProcessingId(null);
  }
};

const handleAddToCart = async (productId) => {
  try {
    setProcessingId(productId);

    await addToCart({
      productId,
      quantity: 1,
    }).unwrap();

  } catch (err) {
    console.log(err);
  } finally {
    setProcessingId(null);
  }
};


  return (

  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-8">

    <div>

        <h1 className="text-3xl font-bold">
            My Wishlist
        </h1>

        <p className="text-gray-500">

            {wishlistProducts.length} product
            {wishlistProducts.length !== 1 && "s"}

        </p>

    </div>

    {wishlistProducts.length > 0 && (

        <button
            onClick={handleEmptyWishlist}
            className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-5
            py-2
            rounded-xl
            "
        >

            Empty Wishlist

        </button>

    )}

</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {wishlistProducts.map((product) => (

          <div
            key={product._id}
            className="
            bg-white
            dark:bg-gray-800
            rounded-2xl
            shadow-md
            overflow-hidden
            flex
            flex-col
            "
          >

            <div className="h-56 bg-gray-100 dark:bg-gray-700 flex justify-center items-center">

              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4"
              />

            </div>

            <div className="p-5 flex flex-col flex-1">

              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full w-fit">

                {product.category?.name || "General"}

              </span>

              <h2 className="text-lg font-semibold mt-3 text-gray-800 dark:text-white">

                {product.name}

              </h2>

              <p className="mt-3 text-green-600 font-bold text-lg">

                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                }).format(product.priceKsh)}

              </p>

              <p className="mt-2 text-sm text-green-600">

                In Stock

              </p>


<div className="mt-6 flex gap-3">

  <button
    onClick={() => handleRemove(product._id)}
    disabled={processingId === product._id}
    className="
      flex-1
      flex
      justify-center
      items-center
      gap-2
      bg-red-500
      hover:bg-red-600
      text-white
      py-2
      rounded-xl
      transition
    "
  >

    {processingId === product._id ? (
      <LoaderCircle
        size={18}
        className="animate-spin"
      />
    ) : (
      <>
        <Trash2 size={18} />
        Remove
      </>
    )}

  </button>

  <button
    onClick={() => handleAddToCart(product._id)}
    disabled={processingId === product._id}
    className="
      flex-1
      flex
      justify-center
      items-center
      gap-2
      bg-green-600
      hover:bg-green-700
      text-white
      py-2
      rounded-xl
      transition
    "
  >

    {processingId === product._id ? (
      <LoaderCircle
        size={18}
        className="animate-spin"
      />
    ) : (
      <>
        <ShoppingCart size={18} />
        Add
      </>
    )}

  </button>

</div>
            </div>

          </div>

        ))}

      </div>

    </div>

  </div>
);


  
};

export default Wishlist;