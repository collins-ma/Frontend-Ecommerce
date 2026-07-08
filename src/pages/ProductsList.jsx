import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import useAuth from "../hooks/useAuth";

import useDocumentTitle from "../hooks/useDocumentTitle";
import { Search,X ,LoaderCircle} from "lucide-react";
import ProductSkeleton from "../app/skeletons/ProductsSkeleton";

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


  
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
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
   
  };


  if (isLoading) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        {error?.data?.message || "Failed to load products"}
      </p>
    );

const allProducts =
  products?.ids.map((id) => products.entities[id]) || [];

const filteredProducts = allProducts.filter((product) => {
  const keyword = search.toLowerCase().trim();

  return (
    product.name?.toLowerCase().includes(keyword) ||
    product.description?.toLowerCase().includes(keyword) ||
    product.category?.name?.toLowerCase().includes(keyword)
  );
});

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

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 py-2">

  <button
    onClick={() => handleCategoryClick("")}
    className={`px-5 py-2 rounded-full transition text-left sm:text-center ${
      selectedCategory === ""
        ? "bg-black text-white"
        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    }`}
  >
    All
  </button>

  {categories?.ids.map((id) => {
    const cat = categories.entities[id];

    return (
      <button
        key={cat._id}
        onClick={() => handleCategoryClick(cat.name)}
        className={`px-5 py-2 rounded-full transition text-left sm:text-center ${
          selectedCategory === cat.name
            ? "bg-black text-white"
            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        {cat.name}
      </button>
    );
  })}
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

      {/* Search */}
<div className="max-w-7xl mx-auto w-full px-4 mb-6">
  <div className="relative">

    <Search
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      value={search}
      placeholder="Search products, categories..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-green-600 dark:text-white"
    />

    {search && (
      <button
        onClick={() => setSearch("")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
      >
        <X size={18} />
      </button>
    )}

  </div>

  

  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
    {filteredProducts.length} product
    {filteredProducts.length !== 1 ? "s" : ""}
    {search && (
      <>
        {" "}found for <span className="font-semibold">"{search}"</span>
      </>
    )}
  </p>


  {/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 flex-1 mb-10">
  {filteredProducts.length === 0 ? (
    <div className="col-span-full text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
        No products found
      </h2>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Try another search.
      </p>
    </div>
  ) : (
    filteredProducts.map((product) => {
      const selectedQuantity = quantities[product._id] || 1;
      const isAdding = addingItemId === product._id;

      return (
        <div
          key={product._id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover hover:scale-110 transition-transform duration-500"
          />

          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
              {product.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
              }).format(product.priceKsh)}
            </p>

            <p className="text-sm mt-1 text-green-600 font-medium">
              ✓ In Stock
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
  className="mt-4 w-full bg-black dark:bg-gray-900 text-white py-2 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition disabled:opacity-60 flex items-center justify-center"
  onClick={() => handleAddToCart(product._id)}
  disabled={isAdding}
>
  {isAdding ? (
    <LoaderCircle className="w-5 h-5 animate-spin" />
  ) : (
    "Add to Cart"
  )}
</button>

          </div>
        </div>
      );
    })
  )}
</div>
</div>
</div>


  );
};

export default ProductsList;