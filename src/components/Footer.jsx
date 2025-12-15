import React from "react";
const Footer = () => {
    return (


      <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h2 className="text-xl font-bold text-white">My E-Commerce Store</h2>
        <p className="text-gray-400 mt-2 leading-relaxed text-sm">
          Your trusted online shop for quality products at affordable prices.
        </p>
      </div>

      <div>
        <h3 className="text-md font-semibold text-white mb-2">Quick Links</h3>
        <ul className="space-y-1 text-sm">
          <li><a className="hover:text-green-400">Home</a></li>
          <li><a className="hover:text-green-400">Shop</a></li>
          <li><a className="hover:text-green-400">About Us</a></li>
          <li><a className="hover:text-green-400">Contact</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-md font-semibold text-white mb-2">Support</h3>
        <ul className="space-y-1 text-sm">
          <li><a className="hover:text-green-400">FAQs</a></li>
          <li><a className="hover:text-green-400">Returns</a></li>
          <li><a className="hover:text-green-400">Shipping Info</a></li>
          <li><a className="hover:text-green-400">Privacy Policy</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-md font-semibold text-white mb-2">Follow Us</h3>
        <div className="flex gap-3 text-sm">
          <a className="hover:text-green-400">Facebook</a>
          <a className="hover:text-green-400">Twitter</a>
          <a className="hover:text-green-400">Instagram</a>
        </div>
      </div>
    </div>

    <hr className="border-gray-700 my-4" />

    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
      <p>© 2025 My E-Commerce Store. All rights reserved.</p>
      <p className="mt-2 md:mt-0">Designed with ❤️ using React + Tailwind CSS</p>
    </div>

  </div>
</footer>


      
    );
  };
  
  export default Footer;
  