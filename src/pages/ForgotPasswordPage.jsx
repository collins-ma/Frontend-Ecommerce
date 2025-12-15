import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../features/users/usersApiSlice';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email).unwrap();
      alert('Password reset link sent! Check your email.');
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {isSuccess && <p className="text-green-500 mt-2">Reset link sent successfully!</p>}
      {isError && <p className="text-red-500 mt-2">{error?.data?.message || 'Error occurred'}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
