import React from 'react'
import { useEffect, useState } from "react";
import { Wifi, WifiOff, LoaderCircle, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    let reconnectTimer;
    let successTimer;

    const handleOffline = () => {
      setIsOnline(false);
      setReconnecting(false);

      reconnectTimer = setTimeout(() => {
        setReconnecting(true);
      }, 2000);
    };

    const handleOnline = () => {
      clearTimeout(reconnectTimer);

      setIsOnline(true);
      setReconnecting(false);
      setShowOnline(true);

      successTimer = setTimeout(() => {
        setShowOnline(false);
      }, 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      clearTimeout(reconnectTimer);
      clearTimeout(successTimer);
    };
  }, []);

  return (
    <AnimatePresence>

      {/* OFFLINE */}
      {!isOnline && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-[9999]"
        >
          <div className="bg-red-600 text-white shadow-xl">

            <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-4">

              {!reconnecting ? (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  <WifiOff size={32} />
                </motion.div>
              ) : (
                <LoaderCircle
                  size={32}
                  className="animate-spin"
                />
              )}

              <div>

                {!reconnecting ? (
                  <>
                    <h2 className="font-bold text-lg">
                      📶 No Internet Connection
                    </h2>

                    <p className="text-red-100">
                      Please check your network.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-bold text-lg">
                      🔄 Reconnecting...
                    </h2>

                    <p className="text-red-100">
                      Attempting to restore your connection.
                    </p>
                  </>
                )}

              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* ONLINE */}
      {isOnline && showOnline && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-[9999]"
        >
          <div className="bg-green-600 text-white shadow-xl">

            <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-4">

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                }}
              >
                <CheckCircle2 size={32} />
              </motion.div>

              <div>

                <h2 className="font-bold text-lg">
                  ✅ Back Online
                </h2>

                <p className="text-green-100">
                  Your connection has been restored.
                </p>

              </div>

            </div>

          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
};

export default NetworkStatus;