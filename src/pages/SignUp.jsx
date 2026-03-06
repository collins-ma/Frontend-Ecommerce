import React, { useState, useEffect } from "react";
import { useRegisterMutation } from "../auth/authApiSlice";
import { useNavigate, Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

function SignUp() {
  useDocumentTitle("Sign Up");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber))
      newErrors.phoneNumber = "Phone number must contain 10-15 digits and optionally start with +";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const newUser = await register({ username, email, phoneNumber, password }).unwrap();
      setSuccessMessage("Account created successfully!");
      navigate("/verify", { state: { email } });
    } catch (err) {
      console.error("Registration failed", err);
      setErrors({ submit: err?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-4 text-black">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Create Your Account
        </h2>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm text-center font-semibold shadow-md transition-all duration-300">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {errors.submit && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-sm text-center font-semibold shadow-md transition-all duration-300">
            {errors.submit}
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
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="text"
            value={phoneNumber}
            placeholder="Phone Number (+1234567890)"
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;