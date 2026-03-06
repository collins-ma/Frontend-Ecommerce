import React, { useState, useEffect, useRef } from "react";
import {
  FiLogOut,
  FiHome,
  FiMoreVertical,
  FiSettings,
  FiUser,
  
} from "react-icons/fi";
import { useOnSendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CartIcon from "../pages/CartIcon";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { isAdmin } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [extraDropdownOpen, setExtraDropdownOpen] = useState(false);
  const [extraDropdownVisible, setExtraDropdownVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef(null);
  const extraDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [onSendLogout] = useOnSendLogoutMutation();

  
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        handleCloseDropdown();
      if (
        extraDropdownRef.current &&
        !extraDropdownRef.current.contains(event.target)
      )
        handleCloseExtraDropdown();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenDropdown = () => {
    setDropdownVisible(true);
    setDropdownOpen(true);
  };
  const handleCloseDropdown = () => {
    setDropdownOpen(false);
    setTimeout(() => setDropdownVisible(false), 200);
  };
  const toggleDropdown = () =>
    dropdownOpen ? handleCloseDropdown() : handleOpenDropdown();

  const handleOpenExtraDropdown = () => {
    setExtraDropdownVisible(true);
    setExtraDropdownOpen(true);
  };
  const handleCloseExtraDropdown = () => {
    setExtraDropdownOpen(false);
    setTimeout(() => setExtraDropdownVisible(false), 200);
  };
  const toggleExtraDropdown = () =>
    extraDropdownOpen ? handleCloseExtraDropdown() : handleOpenExtraDropdown();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    handleCloseDropdown();
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
          <div className="flex items-center gap-4">
            {!isAdmin && <CartIcon />}

            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-lg"
                title="Select Theme"
              >
                {themeIcons[theme]}
              </button>
              {dropdownVisible && (
                <div
                  className={`absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-md overflow-hidden z-50
                    transform transition-all duration-200 ease-out
                    ${
                      dropdownOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1"
                    }`}
                >
                  {["system", "light", "dark"].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <span>{themeIcons[t]}</span>
                      <span className="capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            
            <div className="relative" ref={extraDropdownRef}>
              <button
                onClick={toggleExtraDropdown}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-lg"
                title="More Options"
              >
                <FiMoreVertical />
              </button>
              {extraDropdownVisible && (
                <div
                  className={`absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 rounded-md overflow-hidden z-50
                    transform transition-all duration-200 ease-out
                    ${
                      extraDropdownOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1"
                    }`}
                >
                  <Link
                    to="/settings"
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                  >
                    <FiSettings /> Settings
                  </Link>
                  <Link to="/change-profile" className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <FiUser /> Profile
                  </Link>
                  
                </div>
              )}
            </div>

          
            <div className="relative flex flex-col items-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                title="Logout"
              >
                <FiLogOut />
              </button>

              {errorMessage && (
                <div
                  className={`mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-lg transition-all duration-300 transform opacity-100`}
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}