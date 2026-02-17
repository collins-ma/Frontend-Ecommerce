import React, { useState, useEffect, useRef } from "react";
import { FiLogOut, FiHome, FiMoreVertical, FiSettings, FiUser, FiHelpCircle } from "react-icons/fi";
import { useOnsendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate, useLocation,Link } from "react-router-dom";
import CartIcon from "../pages/cartIcon";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { isAdmin } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [extraDropdownOpen, setExtraDropdownOpen] = useState(false);
  const [extraDropdownVisible, setExtraDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);
  const extraDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [OnsendLogout] = useOnsendLogoutMutation();

  // Apply theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) handleCloseDropdown();
      if (extraDropdownRef.current && !extraDropdownRef.current.contains(event.target)) handleCloseExtraDropdown();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenDropdown = () => {
    setDropdownVisible(true);
    setDropdownOpen(true);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
    setTimeout(() => setDropdownVisible(false), 200); // match animation duration
  };

  const toggleDropdown = () => (dropdownOpen ? handleCloseDropdown() : handleOpenDropdown());

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
    try {
      navigate('/login')
      await OnsendLogout().unwrap();
      toast.success("Logged out successfully!", {
        duration: 1000,
        style: { background: "#000", color: "#fff", fontWeight: "bold" },
      });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("Failed to logout:", err);
      toast.error("Logout failed", {
        style: { background: "#000", color: "#fff", fontWeight: "bold" },
      });
    }
  };

  const themeIcons = { system: "🖥️", light: "☀️", dark: "🌙" };
  const publicPages = ["/login", "/signup", "/", "/verify","forgot-password"];
  const isPublicPage = publicPages.includes(location.pathname);

  // Home icon logic
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

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <header className="h-16 w-full flex justify-between items-center px-6 bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
        {/* Left Side - Home Icon */}
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

        {/* Right Side */}
        {!isPublicPage && (
          <div className="flex items-center gap-4">
            {!isAdmin && <CartIcon />}

            {/* Theme Dropdown */}
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
                    ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"}`}
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

            {/* Extra Dropdown */}
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
                    ${extraDropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"}`}
                >
                 <Link
  to="/settings"
  className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
>
  <FiSettings /> Settings
</Link>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <FiUser /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <FiHelpCircle /> Help
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        )}
      </header>
    </>
  );
}
