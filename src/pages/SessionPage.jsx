import React, { useState } from "react";
import {
  useGetSessionsQuery,
  useLogoutSelectedMutation,
} from "../features/session/sessionApiSlice";
import useAuth from "../hooks/useAuth";
import { Monitor, Smartphone, Tablet, Laptop, Check } from "lucide-react";

// Parse user agent
const parseDeviceInfo = (uaString = "") => {
  const ua = uaString.toLowerCase();

  let device = "Unknown Device";
  let browser = "Unknown Browser";
  let icon = <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-300" />;

  if (ua.includes("windows")) {
    device = "Windows PC";
    icon = <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  } else if (ua.includes("macintosh")) {
    device = "MacOS";
    icon = <Laptop className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  } else if (ua.includes("iphone")) {
    device = "iPhone";
    icon = <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  } else if (ua.includes("ipad")) {
    device = "iPad";
    icon = <Tablet className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  } else if (ua.includes("android") && ua.includes("mobile")) {
    device = "Android Phone";
    icon = <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  } else if (ua.includes("android")) {
    device = "Android Tablet";
    icon = <Tablet className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
  }

  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edg")) browser = "Edge";

  return { device, browser, icon };
};

export default function SessionPage() {
  const [selected, setSelected] = useState([]);

  const { data: sessionsData, isLoading } = useGetSessionsQuery();
  const [logoutSelected] = useLogoutSelectedMutation();
  const { currentSessionId } = useAuth();

  if (isLoading)
    return (
      <p className="text-gray-500 text-center mt-20">
        Loading your sessions...
      </p>
    );

  const sessions = sessionsData?.entities || {};
  const sessionIds = sessionsData?.ids || [];

  const currentSession = sessionIds
    .map((id) => sessions[id])
    .find((s) => s.sessionId === currentSessionId);

  const otherSessions = sessionIds
    .map((id) => sessions[id])
    .filter((s) => s.sessionId !== currentSessionId);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLogoutSelected = async () => {
    if (selected.length === 0)
      return alert("Select at least one session to logout");
    await logoutSelected({ sessionIds: selected });
    setSelected([]);
  };

  const renderCard = (s, isCurrent = false) => {
    const info = parseDeviceInfo(s.userAgent);

    return (
      <div
        key={s.sessionId}
        className={`backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border 
          border-white/40 dark:border-gray-700 shadow-xl rounded-2xl p-6
          transition duration-300 hover:scale-[1.02]
          ${isCurrent ? "ring-2 ring-green-400" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              {info.icon}
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {info.device} • {info.browser}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                IP Address: {s.ipAddress}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Last Active:{" "}
                {new Date(s.lastActive || s.createdAt).toLocaleString()}
              </p>

              {isCurrent && (
                <span className="inline-flex items-center gap-2 mt-3 text-xs font-medium bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4" />
                  Current Device
                </span>
              )}
            </div>
          </div>

          {!isCurrent && (
            <input
              type="checkbox"
              checked={selected.includes(s.sessionId)}
              onChange={() => toggleSelect(s.sessionId)}
              className="h-5 w-5 accent-blue-600 cursor-pointer"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Security & Active Sessions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Review and manage devices logged into your account.
          </p>
        </div>

        {/* Current Device Section */}
        {currentSession && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Current Device
            </h2>
            {renderCard(currentSession, true)}
          </div>
        )}

        {/* Other Sessions */}
        {otherSessions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Other Devices
            </h2>

            <div className="space-y-6">
              {otherSessions.map((s) => renderCard(s))}
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleLogoutSelected}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition duration-300"
              >
                Logout Selected Devices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}