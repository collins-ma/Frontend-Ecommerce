import React from "react";
import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Page title stays for all settings pages */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Settings
        </h1>

        {/* Child routes render here */}
        <Outlet />
      </div>
    </div>
  );
}