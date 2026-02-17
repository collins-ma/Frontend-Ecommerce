import React, { useState, useRef } from "react";
import { useLoginMutation } from "../auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import usePersist from "../hooks/usePersist";

function Login() {
  const [persist, setPersist] = usePersist();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastRef = useRef({ error: false, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      if (!toastRef.current.error) {
        toastRef.current.error = true;
        toast.error("Please fill in all fields", {
          id: "login-toast",
          style: { background: "#000", color: "#fff" },
          duration: 2000,
          onClose: () => (toastRef.current.error = false),
        });
      }
      return;
    }

    try {
      const userData= await login({ username, password }).unwrap();
      console.log("Login successful", userData);
      // --- Handle unverified accounts ---
      if (userData.needsVerification) {
        navigate("/verify", { state: { email: userData.email } });
        return;
      }

      // --- Verified: save credentials and navigate ---
      dispatch(setCredentials(userData.accessToken));

      const decoded = jwtDecode(userData.accessToken);
      const roles = decoded?.roles || [];
      const isAdmin = roles.includes("admin");
      const isUser = roles.includes("user");

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        return navigate(redirectPath, { replace: true });
      }

      if (isAdmin) navigate("/admin/dashboard", { replace: true });
      else if (isUser) navigate("/products", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed", err);
      if (!toastRef.current.error) {
        toastRef.current.error = true;
        toast.error(err?.data?.message || "Invalid credentials", {
          id: "login-toast",
          style: { background: "#000", color: "#fff" },
          duration: 2000,
          onClose: () => (toastRef.current.error = false),
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-4 text-black">
        <h2 className="text-3xl font-bold text-center mb-6">
          Login to ShopVista
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* KEEP ME LOGGED IN */}
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={persist}
              onChange={() => setPersist((prev) => !prev)}
              className="w-4 h-4"
            />
            Keep me logged in
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;