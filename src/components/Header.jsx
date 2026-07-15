import React, { useState, useEffect, useRef } from "react";
import {
  FiLogOut,
  FiHome,
  FiSettings,
  FiUser,
  FiMenu,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";
import { useOnSendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CartIcon from "../pages/CartIcon";
import useAuth from "../hooks/useAuth";
import {useSelector} from "react-redux"
import { selectCurrentToken } from "../auth/authSlice";

export default function Header() {
  const { isAdmin } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );
  const [menuOpen, setMenuOpen] = useState(false);
const [menuVisible, setMenuVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [onSendLogout] = useOnSendLogoutMutation();
  const token=useSelector(selectCurrentToken)

  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      closeMenu();
    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

}, []);
  
  const openMenu = () => {
  setMenuVisible(true);
  setMenuOpen(true);
};

const closeMenu = () => {
  setMenuOpen(false);

  setTimeout(() => {
    setMenuVisible(false);
  }, 200);
};

const toggleMenu = () => {
  menuOpen ? closeMenu() : openMenu();
};
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
   closeMenu();
  };

  const handleLogout = async () => {
   
      navigate("/login");
    setErrorMessage("");
    try {
      await onSendLogout().unwrap();
      
    } catch (err) {
      setErrorMessage(err?.data?.message || "Logout failed. Please try again.");
    }
  };

  const requireLogin = (path) => {
  if (!token) {
    navigate("/login", {
      state: {
        from: path,
        showLoginModal: true,
      },
    });
    return;
  }

  navigate(path);
};

  const themeIcons = { system: "🖥️", light: "☀️", dark: "🌙" };
  const publicPages = ["/login", "/signup", "/", "/verify", "/forgot-password","/reset-password"];
  const isPublicPage = publicPages.includes(location.pathname);

  let showHome = false;
  let homeRoute = "/";
  let homeTitle = "";

  if (isAdmin) {
    showHome = !publicPages.includes(location.pathname);
    homeRoute = "/admin/dashboard";
    homeTitle = "Dashboard";
  } else {
    const hideUserHome = [...publicPages, "/products"];
    showHome = !hideUserHome.includes(location.pathname);
    homeRoute = "/products";
    homeTitle = "Products";
  }

  // Auto hide error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <>
      <header className="h-16 w-full flex justify-between items-center px-6 bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
        
        <div>
          {showHome && (
            <button
              onClick={() => navigate(homeRoute)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 transition"
              title={homeTitle}
            >
              <FiHome />
            </button>
          )}
        </div>

        {!isPublicPage && (
  <div className="flex items-center gap-3">

    <div className="relative" ref={menuRef}>

      <button
        onClick={toggleMenu}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <FiMenu size={20} />
      </button>

      {menuVisible && (
        <div
          className={`
  absolute
  right-0
  mt-3
  w-64
  bg-white
  dark:bg-gray-900
  rounded-2xl
  border
  border-gray-200
  dark:border-gray-700
  shadow-2xl
  overflow-hidden
  transition-all
  duration-200
  origin-top-right
  ${
    menuOpen
      ? "opacity-100 scale-100 translate-y-0"
      : "opacity-0 scale-95 -translate-y-2"
  }
`}
        >

        <button
  onClick={() => requireLogin("/cart")}
  className="
w-full
flex
items-center
gap-3
px-5
py-3
text-green-700
dark:text-green-400
font-medium
hover:bg-green-50
dark:hover:bg-green-900/20
transition-all
duration-200
"
>
  <FiShoppingCart className="text-lg text-green-600" />
  Cart
</button>
          <button
  onClick={() => requireLogin("/my-orders")}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  <FiPackage className="text-lg text-green-600" />
  My Orders
</button>
          <button
  onClick={() => requireLogin("/change-profile")}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  <FiUser className="text-lg text-green-600" />
  Profile
</button>
          
        <button
  onClick={() => requireLogin("/settings")}
  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  <FiSettings className="text-lg text-green-600" />
  Settings
</button>
          <hr />

     <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
Choose Theme
</p>

            <div className="flex gap-2">
            <button
onClick={() => handleThemeChange("light")}
className="
w-10
h-10
rounded-full
bg-white
dark:bg-gray-700
shadow
hover:scale-110
transition
"
>
☀️
</button>
            
              <button
onClick={() => handleThemeChange("dark")}
className="
w-10
h-10
rounded-full
bg-white
dark:bg-gray-700
shadow
hover:scale-110
transition
"
>
🌙
</button>
             

                       
              <button
onClick={() => handleThemeChange("system")}
className="
w-10
h-10
rounded-full
bg-white
dark:bg-gray-700
shadow
hover:scale-110
transition
"
>
🖥️
</button>
            </div>
          </div>

          <hr />

          {token ? (
  <button
    onClick={handleLogout}
    className="
w-full
flex
items-center
gap-3
px-5
py-3
font-semibold
text-red-500
hover:bg-red-50
dark:hover:bg-red-900/20
transition
"
  >
    <FiLogOut className="text-lg" />
    Logout
  </button>
) : (
  <button
    onClick={() =>
      navigate("/login", {
        state: {
          showLoginModal: true,
        },
      })
    }
    className="
w-full
flex
items-center
gap-3
px-5
py-3
font-semibold
text-green-600
hover:bg-green-50
dark:hover:bg-green-900/20
transition
"
  >
    <FiUser className="text-lg" />
    Login / Create Account
  </button>
)}

        </div>
      )}

    </div>

  </div>
)}
       
      </header>
    </>
  );
}