import React from "react";
import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        
        <Outlet />
      </div>
    </div>
  );
}