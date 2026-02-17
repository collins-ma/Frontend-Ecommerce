import { Link } from "react-router-dom";
import React from 'react'

export default function SettingsPage() {
  return (
    <div className="space-y-4">

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Security
        </h2>

        <ul className="space-y-3">
          <Link
            to="change-password"
            className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Change Password
          </Link>

          <Link
            to="sessions"
            className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Sessions
          </Link>
        </ul>
      </section>

    </div>
  );
}