import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { useGetCategoriesQuery } from "../features/categories/categoriesApiSlice";
import { useAddToCartMutation } from "../features/cart/cartApiSlice";
import useAuth from "../hooks/useAuth";

import useDocumentTitle from "../hooks/useDocumentTitle";
import { Search,X ,LoaderCircle,Plus,Minus,ShoppingCart,Heart} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [wishlist, setWishlist] = useState({});


  
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [messageType, setMessageType] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);

  const banners = [
  {
    title: "🔥 Big Electronics Sale",
    description: "Up to 30% OFF Smartphones, Laptops & Accessories",
    button: "Shop Now",
    image: "/banners/iphone.jpg",
  },

  {
    title: "🚚 Free Delivery",
    description: "For orders above KSh 5,000",
    button: "Shop Now",
    image: "/banners/delivery.jpg",
  },

  {
    title: "🆕 New Arrivals",
    description: "Gaming laptops and wireless earbuds available now",
    button: "Explore",
    image: "/banners/gaming-laptop.jpg",
  },
  ]


  useEffect(() => {

  const timer = setInterval(() => {

    setActiveBanner((current) =>
      current === banners.length - 1
        ? 0
        : current + 1
    );

  }, 4000);


  return () => clearInterval(timer);

}, []);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

 
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


const toggleWishlist = (productId) => {
  setWishlist((prev) => ({
    ...prev,
    [productId]: !prev[productId],
  }));
};

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    setAddingItemId(productId);

    try {
      await addToCart({ productId, quantity }).unwrap();

    const product = allProducts.find((p) => p._id === productId);

setMessage(
  quantity > 1
    ? `${quantity} × ${product?.name} added to cart`
    : `${product?.name} added to cart`
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

const categoryIcons = {
  Phones: "📱",
  Laptops: "💻",
  Accessories: "🎧",
  Printers: "🖨",
  "Smart Watches": "⌚",
};

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
        <div className="flex overflow-x-auto gap-3 py-2 scrollbar-hide">
  <motion.button

  initial={{
  opacity: 0,
  y: -15,
}}

animate={{
  opacity: 1,
  y: 0,
}}

whileHover={{
  scale: 1.08,
}}

whileTap={{
  scale: 0.95,
}}

transition={{
  duration: 0.3,
}}
    onClick={() => handleCategoryClick("")}
    className={`px-5 py-2 rounded-full transition text-left sm:text-center ${
      selectedCategory === ""
        ? "bg-black text-white"
        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    }`}
  >
    All
  </motion.button>

  {categories?.ids.map((id) => {
    const cat = categories.entities[id];

    return (
      <motion.button

      initial={{
  opacity: 0,
  y: -15,
}}

animate={{
  opacity: 1,
  y: 0,
}}

whileHover={{
  scale: 1.08,
}}

whileTap={{
  scale: 0.95,
}}

transition={{
  duration: 0.3,
}}

        key={cat._id}
        onClick={() => handleCategoryClick(cat.name)}
        className={`px-5 py-2 rounded-full transition text-left sm:text-center ${
          selectedCategory === cat.name
            ? "bg-black text-white"
            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      >
      <>
    {categoryIcons[cat.name] || "📦"} {cat.name}
  </>
      </motion.button>
    );
  })}
</div>
      </div>


<motion.div
  key={activeBanner}
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4 }}
  className="
    max-w-7xl
    mx-auto
    w-full
    px-4
    mt-4
  "
>

<div
className="
rounded-2xl
overflow-hidden
bg-white
dark:bg-gray-800
shadow-md
grid
grid-cols-2
items-center
h-32
"
>

<div className="p-3 md:p-4">

<h2
className="
text-sm
md:text-lg
font-bold
text-gray-800
dark:text-white
"
>
{banners[activeBanner].title}
</h2>


<p
className="
mt-1
text-xs
md:text-sm
text-gray-600
dark:text-gray-300
line-clamp-2
"
>
{banners[activeBanner].description}
</p>


<button
className="
mt-2
bg-green-600
text-white
px-3
py-1
text-xs
rounded-lg
font-semibold
hover:bg-green-700
transition
"
>
{banners[activeBanner].button}
</button>


</div>


<img
src={banners[activeBanner].image}
alt={banners[activeBanner].title}
className="
w-full
h-32
object-cover
"
/>


</div>

</motion.div>


      {/* Welcome */}
          <motion.div
  initial={{ opacity: 0, y: -25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="max-w-7xl mx-auto mb-4 text-center mt-4 px-4"
>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Welcome,{" "}
          <span className="text-green-600 dark:text-green-400">
            {username}
          </span>
          !
        </h1>
      </motion.div>

      {/* Search */}
<motion.div
  initial={{
    opacity: 0,
    scale: 0.95,
  }}
  animate={{
    opacity: 1,
    scale: 1,
  }}
  transition={{
    duration: 0.4,
    delay: 0.2,
  }}
  className="max-w-7xl mx-auto w-full px-4 mb-6"
>
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
    filteredProducts.map((product, index) => {
      const selectedQuantity = quantities[product._id] || 1;
      const isAdding = addingItemId === product._id;

      return (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{
            duration: 0.35,
            delay: index * 0.05,
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
      active:scale-95
      transition-all
    "
  >
    <Heart
      className={`w-5 h-5 transition-colors ${
        wishlist[product._id]
          ? "fill-red-500 text-red-500"
          : "text-gray-500"
      }`}
    />
  </button>
</div>
          <div className="p-3 sm:p-4" >
            <span className="inline-block mb-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              {product.category?.name || "General"}
            </span>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
              {product.name}
            </h2>

            <div className="flex items-center mt-2">
  <span className="text-yellow-400">★★★★★</span>

  <span className="ml-2 text-sm text-gray-500">
    (4.8)
  </span>
</div>

            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
              }).format(product.priceKsh)}
            </p>

            <p className="mt-1 text-sm text-green-600 font-medium">
              In Stock
            </p>

            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(product._id)}
                 className="
w-8 h-8 sm:w-9 sm:h-9
rounded-full
bg-red-100
border border-red-300
text-red-600
hover:bg-red-200
hover:scale-110
active:scale-95
transition-all duration-200
flex items-center justify-center
shadow-sm
"
                  
                 
                >
                  <Minus size={16} />
                </button>

                <span className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedQuantity}
                </span>

                <button
                  type="button"
                  onClick={() => increaseQuantity(product._id)}
                 className="
w-8 h-8 sm:w-9 sm:h-9
rounded-full
bg-green-100
border border-green-300
text-green-600
hover:bg-green-200
hover:scale-110
active:scale-95
transition-all duration-200
flex items-center justify-center
shadow-sm
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
    })
  )}
</div>
    </motion.div>
</div>
);
};


export default ProductsList;