import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  clearAuthError,
  selectAuthError
} from "../auth/authSlice";
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


  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read auth error from Redux
  const authError = useSelector(selectAuthError);

  // Show auth error (e.g. session expired / logged out from another device)
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);

      const timer = setTimeout(() => {
        dispatch(clearAuthError());
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authError, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
  
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const userData = await login({ username, password }).unwrap();

      if (userData?.needsVerification) {
        navigate("/verify", {
          state: { email: userData.email },
        });
        return;
      }

      // Successful login
      dispatch(clearAuthError());
      dispatch(setCredentials(userData));

      // setSuccessMessage("Login successful!");

      const decoded = jwtDecode(userData.accessToken);
      const roles = decoded?.roles || [];

      const isAdmin = roles.includes("admin");
      const isUser = roles.includes("user");

      const lastPage = localStorage.getItem("lastPage");

      setTimeout(() => {
        if (lastPage && lastPage !== "/login") {
          navigate(lastPage, { replace: true });
        } else {
          if (isAdmin) {
            navigate("/admin/dashboard", { replace: true });
          } else if (isUser) {
            navigate("/products", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }

        localStorage.removeItem("lastPage");
      }, 1000);
    } catch (err) {
      setErrorMessage(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
     <div
className="
w-full
max-w-md
bg-white
dark:bg-gray-800
rounded-3xl
shadow-2xl
border
border-gray-200
dark:border-gray-700
p-8
flex
flex-col
gap-5
"
>
      
    <div className="text-center">
<h2 className="text-3xl font-bold text-gray-800 dark:text-white">
Welcome Back
</h2>

<p className="text-gray-500 dark:text-gray-400 mt-2">
Sign in to continue shopping.
</p>
</div>
       {errorMessage && (
       <p className="text-red-600 text-center font-semibold">
      {errorMessage}
       </p>
)}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            placeholder="Username"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
      className="
w-full
px-4
py-3
rounded-xl
border
border-gray-300
bg-white
dark:bg-gray-700
dark:border-gray-600
text-gray-800
dark:text-white
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-green-600
focus:border-green-600
transition
"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
             className="
w-full
px-4
pr-12
py-3
rounded-xl
border
border-gray-300
bg-white
dark:bg-gray-700
dark:border-gray-600
text-gray-800
dark:text-white
placeholder:text-gray-400
focus:outline-none
focus:ring-2
focus:ring-green-600
focus:border-green-600
transition
"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
          className="
absolute
right-4
top-1/2
-translate-y-1/2
text-gray-400
hover:text-green-600
transition
"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
             className="text-green-600 hover:text-green-700"
            >
              Forgot Password?
            </button>
          </div>
<label
  className="
    flex
    items-center
    gap-3
    text-gray-700
    dark:text-gray-300
    text-sm
    select-none
    cursor-pointer
  "
>
  <input
    type="checkbox"
    checked={persist}
    onChange={() => setPersist((prev) => !prev)}
    className="
      w-4
      h-4
      rounded
      accent-green-600
      cursor-pointer
    "
  />

  <span>Keep me logged in</span>
</label>
          <button
            type="submit"
            disabled={isLoading}
            className="
w-full
bg-gradient-to-r
from-green-600
to-green-700
text-white
py-3
rounded-xl
font-semibold
hover:from-green-700
hover:to-green-800
transition-all
duration-300
hover:scale-[1.02]
active:scale-95
shadow-lg
hover:shadow-xl
disabled:opacity-50
"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;