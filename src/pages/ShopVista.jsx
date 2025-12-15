import React from 'react';
import { Link } from 'react-router-dom';

function ShopVista() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-orange-100 to-purple-200 flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6 bg-white shadow-md sticky top-0 z-50">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="text-2xl text-blue-600 animate-bounce">🛍️</div>
          <div>
            <span className="text-2xl font-bold text-blue-600">ShopVista</span>
            <span className="text-sm text-gray-600 ml-1">Your favorite online store</span>
          </div>
        </div>

        {/* Right: Login/Signup */}
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16 bg-gradient-to-r from-blue-200 via-orange-100 to-purple-200 rounded-b-3xl">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-800">
          Welcome to <span className="text-blue-600">ShopVista</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Discover amazing products and enjoy a seamless shopping experience.
        </p>
        <Link
          to="/products"
          className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300"
        >
          Start Shopping
        </Link>
      </div>

      {/* Feature Highlights */}
      <section className="py-16 px-6 bg-white w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Shop With Us?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 duration-300">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Get your orders delivered quickly and reliably anywhere.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 duration-300">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-gray-600">Your payment information is protected with industry-standard encryption.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 duration-300">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="font-semibold text-lg mb-2">Great Selection</h3>
            <p className="text-gray-600">We offer a wide variety of products to suit every taste.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 w-full bg-white">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Our Customers Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {["Alice", "Bob", "Clara"].map((name, i) => (
            <div key={i} className="p-6 bg-orange-50 rounded-lg shadow text-center transform hover:scale-105 transition duration-300">
              <p className="text-gray-700 mb-4">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod ex sit amet justo."
              </p>
              <span className="font-semibold text-gray-800">— {name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-700">
          &copy; {new Date().getFullYear()} ShopVista. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default ShopVista;
