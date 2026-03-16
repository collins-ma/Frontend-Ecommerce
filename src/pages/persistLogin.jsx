import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useRefreshMutation } from "../auth/authApiSlice";
import { Navigate, Outlet } from "react-router-dom";
import usePersist from "../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";
import React from 'react';

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  // Only attempt refresh if persist is true and no token
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          const result = await refresh(); // do not unwrap
          if (result.data) setTrueSuccess(true);
        } catch (err) {
          console.error("Refresh error:", err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => {
      effectRan.current = true;
    };
  }, [token, persist, refresh]);

 

  // 2️⃣ Case: persist true + loading refresh
  if (isLoading) return <PulseLoader />;

  // 3️⃣ Case: persist true + refresh failed
  if (isError) {
    return (
      <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded-lg text-sm">
        {error?.data?.message || "Session expired"} — Please login again.
      </p>
    );
  }

  // 4️⃣ Case: token exists OR refresh succeeded
  if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
    return <Outlet />;
  }

  // fallback spinner
  return <PulseLoader />;
};

export default PersistLogin;