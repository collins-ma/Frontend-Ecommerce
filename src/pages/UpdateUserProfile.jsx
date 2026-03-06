import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../features/users/usersApiSlice";

export default function ProfilePage() {
  const { userId } = useAuth(); // get userId from token
  const { data: user, isLoading: isFetching, isError, error } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Prefill form when user data is fetched
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateUser({ id: user._id, username, email }).unwrap();
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setErrorMessage(err?.data?.message || "Failed to update profile");
    }
  };

  if (isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed to load profile"}
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Update Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col gap-4"
      >
        {errorMessage && (
          <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-md">
            {successMessage}
          </div>
        )}

        <label className="flex flex-col gap-1">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isUpdating}
          className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}