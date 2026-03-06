import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../features/users/usersApiSlice";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      alert("Password reset successfully!");
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.data?.message || "Something went wrong");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid or missing token</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Reset Password
        </h1>

        {errorMessage && (
          <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}