import React, { useState } from "react";
import {
  FiTrash2,
  FiHeart,
  FiArrowLeft,
} from "react-icons/fi";

import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Heart,
  LoaderCircle,
} from "lucide-react";
import { useGetCartQuery, useRemoveFromCartMutation,useAddToCartMutation } from "../features/cart/cartApiSlice";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useGetProductsQuery } from "../features/products/productsApiSlice";

export default function CartPage() {
  useDocumentTitle('cartPage')
 
  const navigate = useNavigate();

 
  const { data: cart, isLoading, isError, error } = useGetCartQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
const { data: products } = useGetProductsQuery();
const [addToCart, { isLoading: isAddingToCart }] =
  useAddToCartMutation();
const allProducts =
  products?.ids.map((id) => products.entities[id]) || [];

 
  const [removeFromCart, { error: removeError }] = useRemoveFromCartMutation();
  const [removingItemId, setRemovingItemId] = useState(null);
  const [wishlist, setWishlist] = useState({});

  const [quantities, setQuantities] = useState({});
const [addingItemId, setAddingItemId] = useState(null);


const increaseQuantity = (productId) => {
  setQuantities((prev) => ({
    ...prev,
    [productId]: Math.min((prev[productId] || 1) + 1, 10),
  }));
};

const decreaseQuantity = (productId) => {
  setQuantities((prev) => ({
    ...prev,
    [productId]: Math.max((prev[productId] || 1) - 1, 1),
  }));
};
const cartProductIds =
  cart?.items
    ?.filter((item) => item.product)
    .map((item) => item.product._id) || [];

  const recommendedProducts = allProducts
  .filter((product) => !cartProductIds.includes(product._id))
  .slice(0, 4);

  const calculateTotal = () =>
    cart?.items
      .filter((item) => item.product)
      .reduce((acc, item) => acc + item.product.priceKsh * item.quantity, 0) || 0;


      const shipping = 0;

const discount = 5000;

const subtotal = calculateTotal();

const total = Math.max(subtotal - discount, 0);

const toggleWishlist = (productId) => {
  setWishlist((prev) => ({
    ...prev,
    [productId]: !prev[productId],
  }));
};


  const handleRemoveItem = async (productId) => {
    setRemovingItemId(productId);
    try {
await removeFromCart(productId).unwrap();

toast((t) => (
  <div className="flex items-center justify-between gap-4">
    <span>🗑 Item removed from cart</span>

    <button
      onClick={() => toast.dismiss(t.id)}
      className="font-semibold text-green-600"
    >
      UNDO
    </button>
  </div>
));
    } catch (err) {
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleAddToCart = async (productId) => {
  const quantity = quantities[productId] || 1;

  setAddingItemId(productId);

  try {
    await addToCart({
      productId,
      quantity,
    }).unwrap();

    const product = allProducts.find(
      (p) => p._id === productId
    );

    toast.success(
      quantity > 1
        ? `${quantity} × ${product?.name} added to cart`
        : `${product?.name} added to cart`
    );
  } catch (err) {
    toast.error(
      err?.data?.message || "Failed to add to cart"
    );
  } finally {
    setAddingItemId(null);
  }
};
  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading)
    return (
  <div className="flex flex-col items-center">
    <ShoppingCart
        size={60}
        className="text-green-600 animate-bounce"
    />

    <p className="mt-4 text-lg">
        Loading your cart...
    </p>
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
      <div className="text-center">

    <ShoppingCart
        size={70}
        className="mx-auto text-gray-400"
    />

    <h2 className="text-3xl font-bold mt-6">
        Your Cart is Empty
    </h2>

    <p className="mt-3 text-gray-500">
        Looks like you haven't added anything yet.
    </p>

    <button
        onClick={() => navigate("/products")}
        className="mt-8 bg-green-600 text-white px-8 py-3 rounded-xl"
    >
        Start Shopping
    </button>

</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
    

      
      {removeError?.data?.message && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {removeError.data.message}
        </div>
      )}

    <div className="max-w-7xl mx-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between mb-8">

    <h1 className="text-3xl font-bold flex items-center gap-3">

        <ShoppingCart className="text-green-600"/>

        Shopping Cart

        <span className="text-lg text-gray-500">
            ({cart.items.length})
        </span>

    </h1>

</div>
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
                      <div className="flex items-center mt-1">

    <span className="text-yellow-400">
        ★★★★★
    </span>

    <span className="ml-2 text-sm text-gray-500">
        (4.8)
    </span>

</div>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      KSH {item.product.priceKsh}
                    </p>
              
<p className="mt-2 text-green-600 font-medium">
  In Stock
</p>

<p className="text-gray-500 text-sm">
  🚚 Delivery Tomorrow
</p>

<div className="flex items-center gap-3 mt-4">

  <button
    className="w-9 h-9 rounded-full bg-red-100 border border-red-300 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
  >
    <Minus size={16} />
  </button>

  <span className="text-lg font-semibold">
    {item.quantity}
  </span>

  <button
    className="w-9 h-9 rounded-full bg-green-100 border border-green-300 text-green-600 flex items-center justify-center hover:bg-green-200 transition"
  >
    <Plus size={16} />
  </button>

</div>
                  </div>
                </div>
<div className="flex flex-col gap-3 mt-5">

<button
onClick={() => toggleWishlist(item.product._id)}
className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
>

<FiHeart
fill={
wishlist[item.product._id]
? "#ec4899"
: "transparent"
}
/>

Save for Later

</button>

<button
onClick={() => handleRemoveItem(item.product._id)}
className="flex items-center gap-2 text-red-600 hover:text-red-700"
>

<FiTrash2/>

Remove

</button>

</div>
              </div>
            ) : null
          )}
        </div>

        <div className="border-t mt-8 pt-8">

<h2 className="text-2xl font-bold">

Order Summary

</h2>

<div className="flex justify-between mt-5">

<span>Subtotal</span>

<span>
KSh {subtotal.toLocaleString()}
</span>

</div>

<div className="flex justify-between mt-3">

<span>Shipping</span>

<span className="text-green-600">

FREE

</span>

</div>

<div className="flex justify-between mt-3">

<span>Discount</span>

<span>

KSh {discount.toLocaleString()}

</span>

</div>

<hr className="my-6"/>

<div className="flex justify-between text-2xl font-bold">

<span>Total</span>

<span>

KSh {total.toLocaleString()}

</span>

</div>

<div className="bg-green-50 rounded-xl p-4 mt-6">

<div className="flex items-center gap-2 text-green-700">

<ShieldCheck size={20}/>

Secure Checkout

</div>

</div>

<button
onClick={handleProceedToCheckout}
className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700
text-white py-3 rounded-xl font-semibold
hover:scale-[1.02]
transition
flex justify-center items-center gap-2">

💳 Proceed to Checkout

</button>


<div className="mt-14">

<div className="flex items-center gap-3 mb-2">
  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
    <Heart className="w-5 h-5 text-green-600 fill-green-600" />
  </div>

  <h2 className="text-2xl font-bold">
    Customers also bought
  </h2>
</div>

<p className="text-gray-500 mb-8">
Recommended for you
</p>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{recommendedProducts.map((product) => {
    const selectedQuantity = quantities?.[product._id] || 1;
      const isAdding =
  isAddingToCart &&
  addingItemId === product._id;

    return (
   <motion.div
    key={product._id}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ y: -10, scale: 1.02 }}
    transition={{
      duration: 0.35,
    }}
    className="
      group
      bg-white
      dark:bg-gray-800
      rounded-2xl
      shadow-md
      hover:shadow-2xl
      overflow-hidden
      flex
      flex-col
      h-full
    "
  >
    {/* Product Image */}
    <div className="relative">
 <img
    src={product.image}
    alt={product.name}
    className="
      w-full
      h-36
      sm:h-44
      md:h-56
      object-cover
      transition-transform
      duration-500
      group-hover:scale-110
    "
  />
      <button
        onClick={() => toggleWishlist(product._id)}
        className="
          absolute
          top-3
          right-3
          w-10
          h-10
          rounded-full
          bg-white/90
          dark:bg-gray-800/90
          shadow-lg
          flex
          items-center
          justify-center
          hover:scale-110
          transition-all
        "
      >
        <Heart
          className={`w-5 h-5 ${
            wishlist[product._id]
              ? "fill-red-500 text-red-500"
              : "text-gray-500"
          }`}
        />
      </button>
    </div>

<div className="p-3 sm:p-4 flex flex-col flex-1">

      <span className="inline-block mb-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
        {product.category?.name || "General"}
      </span>

      <h2 className="text-lg font-semibold truncate">
        {product.name}
      </h2>

      <div className="flex items-center mt-2">
        <span className="text-yellow-400">
          ★★★★★
        </span>

        <span className="ml-2 text-sm text-gray-500">
          (4.8)
        </span>
      </div>

      <p className="mt-2 font-semibold text-lg">
        {new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES",
        }).format(product.priceKsh)}
      </p>

      <p className="text-green-600 font-medium mt-1">
         In Stock
      </p>

      {/* Quantity */}
   <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
        <span>Quantity</span>

        <div className="flex items-center gap-3">

          <button
            onClick={() => decreaseQuantity(product._id)}
            className="
              w-8 h-8
              rounded-full
              bg-red-100
              border
              border-red-300
              text-red-600
              flex
              items-center
              justify-center
            "
          >
            <Minus size={16} />
          </button>

          <span className="font-semibold">
            {selectedQuantity}
          </span>

          <button
            onClick={() => increaseQuantity(product._id)}
            className="
              w-8 h-8
              rounded-full
              bg-green-100
              border
              border-green-300
              text-green-600
              flex
              items-center
              justify-center
            "
          >
            <Plus size={16} />
          </button>

        </div>
      </div>
<button
              onClick={() => handleAddToCart(product._id)}
              disabled={isAdding}
             className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700
text-white
py-2
sm:py-2.5
text-xs sm:text-sm
rounded-xl
font-semibold
hover:from-green-700 hover:to-green-800
transition-all duration-300
hover:scale-[1.02]
active:scale-95
shadow-lg hover:shadow-xl
flex items-center justify-center gap-2">
              {isAdding ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (

                  <>
             <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>Add to Cart</span>
          </>
          
              )}
            </button>
    </div>
  </motion.div>
    );
})}

</div>

</div>


<button
onClick={() => navigate("/products")}
className="mt-3 w-full border rounded-xl py-3
hover:bg-gray-50
flex items-center justify-center gap-2">

<FiArrowLeft/>

Continue Shopping

</button>

</div>

      </div>
    </div>
  );
}