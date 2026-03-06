import React, { useState, useEffect } from 'react';
import { useChangePasswordMutation } from '../features/users/usersApiSlice';
import { FiCheckCircle } from 'react-icons/fi';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ChangePassword() {
  useDocumentTitle('ChangePassword')
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Check if new password matches confirm password
  useEffect(() => {
    setPasswordMatch(newPassword && confirmPassword && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Frontend validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrors({ form: 'All fields are required' });
      return;
    }

    if (!passwordMatch) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword, confirmPassword }).unwrap();
      setSuccessMessage(res.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrors({ form: err?.data?.message || 'Failed to update password' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {confirmPassword && passwordMatch && (
              <span className="absolute right-3 top-3">
                <FiCheckCircle className="text-green-500" size={20} />
              </span>
            )}
          </div>

          {/* Errors */}
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

          {/* Success message */}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}