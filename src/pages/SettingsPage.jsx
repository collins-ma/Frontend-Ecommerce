import { Link } from "react-router-dom";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 text-center">
          Settings
        </h2>

        {/* Links Section */}
        <section className="space-y-4">
          <Link
            to="change-password"
            className="block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-800 dark:text-gray-100 text-center"
          >
            Change Password
          </Link>

          <Link
            to="sessions"
            className="block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-gray-800 dark:text-gray-100 text-center"
          >
            Sessions
          </Link>
        </section>
      </div>
    </div>
  );
}