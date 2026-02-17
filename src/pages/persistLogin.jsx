import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useRefreshMutation } from "../auth/authApiSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import usePersist from "../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";
import React from 'react'

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();

  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [
    refresh,
    { isUninitialized, isLoading, isSuccess, isError, error },
  ] = useRefreshMutation();

  // 🔁 Try refresh on mount
  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh().unwrap();
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) {
        verifyRefreshToken();
      }
    }

    return () => {
      effectRan.current = true;
    };
  }, [token, persist, refresh]);

  // ❌ Refresh failed → redirect
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isError, navigate]);

  // 🚫 Persist disabled
  if (!persist) {
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  }

  // ⏳ Loading refresh
  if (isLoading) return <PulseLoader />;

  // ❌ Refresh error UI
  if (isError) {
    return (
      <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded-lg text-sm">
        {error?.data?.message || "Session expired"} — Redirecting to login...
      </p>
    );
  }

  // ✅ Auth OK
  if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
    return <Outlet />;
  }

  return <PulseLoader />;
};

export default PersistLogin;