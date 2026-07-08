
import React from "react";
const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden animate-pulse">
      {/* Image */}
      <div className="w-full h-56 bg-gray-300 dark:bg-gray-700"></div>

      <div className="p-4">
        {/* Product name */}
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>

        {/* Price */}
        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>

        {/* Quantity */}
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mt-4"></div>

        {/* Button */}
        <div className="h-11 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mt-4"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;