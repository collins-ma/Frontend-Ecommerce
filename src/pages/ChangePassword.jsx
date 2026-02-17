import React, { useState, useEffect } from 'react';
import { useChangePasswordMutation } from '../features/users/usersApiSlice';
import { FiCheckCircle } from 'react-icons/fi';

export default function ChangePassword() {
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
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Change Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
        {/* Old Password */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          {confirmPassword && passwordMatch && (
            <span className="absolute right-2 top-10">
              <FiCheckCircle className="text-green-500" />
            </span>
          )}
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Form-level error */}
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        {/* Success message */}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {isLoading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}