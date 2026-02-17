import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { FiMenu, FiX } from "react-icons/fi";

const categories = ["Electronics", "Fashion", "Home", "Best Sellers"];

const ProductsList = () => {
  const { username } = useAuth();
  const { data: products, isLoading, isError, error } = useGetProductsQuery("productsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [addToCart] = useAddToCartMutation();
  const [quantities, setQuantities] = useState({});
  const [addingItemId, setAddingItemId] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: Number(value) }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    setAddingItemId(productId);
    try {
      await addToCart({ productId, quantity }).unwrap();
      toast.success(quantity > 1 ? `${quantity} items added!` : `Item added!`, {
        style: { background: "#000", color: "#fff" },
      });
    } catch (err) {
      toast.error("Failed to add to cart", { style: { background: "#000", color: "#fff" } });
    } finally {
      setAddingItemId(null);
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">Loading products...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500 dark:text-red-400">
        {error?.data?.message || "Failed to load products"}
      </p>
    );
  if (!products || products.ids.length === 0)
    return <p className="text-center mt-10 text-gray-700 dark:text-gray-300">No products available.</p>;

  const allProducts = products.ids.map((id) => products.entities[id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Hamburger Menu */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex items-center gap-4">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isMenuOpen ? (
              <FiX size={24} className="text-black dark:text-white" />
            ) : (
              <FiMenu size={24} className="text-black dark:text-white" />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-xl p-4 z-50 transition">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Categories</h3>
              <ul className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {}}
                      className="w-full text-left py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
                <li>
                  <Link
                    to="/my-orders"
                    className="w-full text-left py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium transition"
                  >
                    View Orders
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-7xl mx-auto mb-4 text-center mt-4 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Welcome, <span className="text-green-600 dark:text-green-400">{username}</span>!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg md:text-xl">
          Explore our latest products!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 flex-1 mb-10">
        {allProducts.map((product) => {
          const selectedQuantity = quantities[product._id] || 1;
          const isAdding = addingItemId === product._id;

          return (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative border-2 border-transparent dark:border-gray-700"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover hover:scale-105 transform transition-transform duration-300"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">${product.priceUSD}</p>

                <select
                  value={selectedQuantity}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  className="mt-2 w-full border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>C
                      {i + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="mt-4 w-full bg-black dark:bg-gray-900 text-white py-2 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
