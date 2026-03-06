import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import usePersist from "../hooks/usePersist";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Login() {
  useDocumentTitle("Login");

  const [persist, setPersist] = usePersist();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const userData = await login({ username, password }).unwrap();

      if (userData.needsVerification) {
        navigate("/verify", { state: { email: userData.email } });
        return;
      }

      dispatch(setCredentials(userData.accessToken));

      setSuccessMessage("Login successful!");

      const decoded = jwtDecode(userData.accessToken);
      const roles = decoded?.roles || [];
      const isAdmin = roles.includes("admin");
      const isUser = roles.includes("user");

     

      setTimeout(() => {
        if (isAdmin) navigate("/admin/dashboard", { replace: true });
        else if (isUser) navigate("/products", { replace: true });
        else navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      setErrorMessage(
        err?.data?.message 
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-4 text-black">
        <h2 className="text-3xl font-bold text-center mb-6">
          Login to ShopVista
        </h2>

        
        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm text-center font-semibold shadow-md transition-all duration-300">
            {successMessage}
          </div>
        )}

        
        {errorMessage && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-sm text-center font-semibold shadow-md transition-all duration-300">
            {errorMessage}
          </div>
        )}

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

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

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
            className="p-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        
        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;