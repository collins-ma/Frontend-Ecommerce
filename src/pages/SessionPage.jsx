import React, { useState } from "react";
import {
  useGetSessionsQuery,
  useLogoutSelectedMutation,
  useLogoutAllMutation,
} from "../features/session/sessionApiSlice";
import useAuth from "../hooks/useAuth";

import { Monitor, Smartphone, Tablet, Laptop, Check } from "lucide-react";

// ⭐ Parse the user-agent into readable device + browser + icon
const parseDeviceInfo = (uaString) => {
  const ua = uaString.toLowerCase();

  let device = "Unknown Device";
  let browser = "Unknown Browser";
  let icon = <Monitor className="w-6 h-6 text-gray-600" />;

  // ----- Device Detection -----
  if (ua.includes("windows")) {
    device = "Windows PC";
    icon = <Monitor className="w-6 h-6 text-gray-600" />;
  } else if (ua.includes("macintosh")) {
    device = "MacOS";
    icon = <Laptop className="w-6 h-6 text-gray-600" />;
  } else if (ua.includes("iphone")) {
    device = "iPhone";
    icon = <Smartphone className="w-6 h-6 text-gray-600" />;
  } else if (ua.includes("ipad")) {
    device = "iPad";
    icon = <Tablet className="w-6 h-6 text-gray-600" />;
  } else if (ua.includes("android") && ua.includes("mobile")) {
    device = "Android Phone";
    icon = <Smartphone className="w-6 h-6 text-gray-600" />;
  } else if (ua.includes("android")) {
    device = "Android Tablet";
    icon = <Tablet className="w-6 h-6 text-gray-600" />;
  }

  // ----- Browser Detection -----
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
  const [logoutAll] = useLogoutAllMutation();
  const { currentSessionId } = useAuth();

  if (isLoading)
    return <p className="text-gray-500 text-center mt-10">Loading sessions...</p>;

  const sessions = sessionsData?.entities;
  const sessionIds = sessionsData?.ids || [];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLogoutSelected = async () => {
    if (selected.length === 0) return alert("Select at least one session");
    await logoutSelected({ sessionIds: selected });
    setSelected([]);
  };

  const handleLogoutAllOther = async () => {
    const otherSessions = sessionIds.filter((id) => id !== currentSessionId);
    await logoutSelected({ sessionIds: otherSessions });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Active Sessions</h1>

      <div className="grid gap-4">
        {sessionIds.map((id) => {
          const s = sessions[id];
          const isCurrent = s.sessionId === currentSessionId;

          const info = parseDeviceInfo(s.userAgent);

          return (
            <div
              key={s.sessionId}
              className={`flex items-center justify-between p-4 rounded-xl shadow-md transition ${
                isCurrent
                  ? "bg-green-50 border-2 border-green-400"
                  : "bg-white border"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Device Icon */}
                {info.icon}

                <div>
                  <p
                    className={`font-semibold text-lg ${
                      isCurrent ? "text-green-700" : "text-gray-800"
                    }`}
                  >
                    {info.device} — {info.browser}
                  </p>

                  <p className="text-gray-500 text-sm">{s.ipAddress}</p>

                  <p className="text-gray-400 text-xs">
                    Created: {new Date(s.createdAt).toLocaleString()}
                  </p>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 mt-2 text-green-700 font-medium text-xs bg-green-100 px-2 py-1 rounded-full">
                      <Check className="w-4 h-4" />
                      Currently Used Device
                    </span>
                  )}
                </div>
              </div>

              <input
                type="checkbox"
                disabled={isCurrent}
                checked={selected.includes(s.sessionId)}
                onChange={() => toggleSelect(s.sessionId)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>

      <div className="flex space-x-4 mt-8 justify-center">
        <button
          onClick={handleLogoutSelected}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout Selected
        </button>

        <button
          onClick={handleLogoutAllOther}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Logout All Other Devices
        </button>
      </div>
    </div>
  );
}
