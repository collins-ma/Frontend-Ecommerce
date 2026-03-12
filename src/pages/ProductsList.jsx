import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import useAuth from "../hooks/useAuth";
import { FiMenu, FiX } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";

const ProductsList = () => {
  useDocumentTitle("products");

  const { username } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery(selectedCategory);

  const { data: categories } = useGetCategoriesQuery();
  const [addToCart] = useAddToCartMutation();

  const [quantities, setQuantities] = useState({});
  const [addingItemId, setAddingItemId] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: Number(value) }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    setAddingItemId(productId);

    try {
      await addToCart({ productId, quantity }).unwrap();

    
      setMessage(
        quantity > 1
          ? `${quantity} items added!`
          : "Item added!"
      );
      setMessageType("success");
    } catch (err) {
    
      setMessage(
        err?.data?.message || "Failed to add to cart"
      );
      setMessageType("error");
    } finally {
      setAddingItemId(null);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      setSearchParams({ category: categoryName });
    } else {
      setSearchParams({});
    }
    refetch();
    setIsMenuOpen(false);
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading products...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        {error?.data?.message || "Failed to load products"}
      </p>
    );

  const allProducts =
    products?.ids.map((id) => products.entities[id]) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex items-center gap-4">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50">
              <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                <Link
                  to="/my-orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                >
                  View Orders
                </Link>
              </div>

              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Categories
              </h3>

              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    onClick={() => handleCategoryClick("")}
                    className="w-full text-left py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                  >
                    All Products
                  </button>
                </li>

                {categories?.ids.map((id) => {
                  const cat = categories.entities[id];
                  return (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full text-left py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                      >
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Welcome */}
      <div className="max-w-7xl mx-auto mb-4 text-center mt-4 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Welcome,{" "}
          <span className="text-green-600 dark:text-green-400">
            {username}
          </span>
          !
        </h1>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 flex-1 mb-10">
        {allProducts.map((product) => {
          const selectedQuantity = quantities[product._id] || 1;
          const isAdding = addingItemId === product._id;

          return (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {product.name}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  KSH {product.priceKsh}
                </p>

                <select
                  value={selectedQuantity}
                  onChange={(e) =>
                    handleQuantityChange(product._id, e.target.value)
                  }
                  className="mt-2 w-full border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="mt-4 w-full bg-black dark:bg-gray-900 text-white py-2 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition disabled:opacity-60"
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