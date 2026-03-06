import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../features/users/usersApiSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
const ForgotPasswordPage = () => {
  useDocumentTitle('forgot-password')
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Feedback Messages */}
        <div className="mt-4 text-center">
          {isSuccess && (
            <p className="text-green-500">Reset link sent successfully! Check your email.</p>
          )}
          {isError && (
            <p className="text-red-500">{error?.data?.message || 'Failed to send reset link'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;