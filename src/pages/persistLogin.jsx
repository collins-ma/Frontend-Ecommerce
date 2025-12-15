import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import { useRefreshMutation } from "../auth/authApiSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import usePersist from "../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";
import React from "react";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();

  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [
    refresh,
    { isUninitialized, isLoading, isSuccess, isError, error },
  ] = useRefreshMutation();

  // Verify refresh token if persist is enabled
  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
           await refresh();
       
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

  // Redirect effect (always runs, guards inside)
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isError, navigate]);

  /* =========================
     CASE 1: persist = false
  ============================*/
  if (!persist) {
    if (token) return <Outlet />; // user just logged in
    return <Navigate to="/login" replace />;
  }

  /* =========================
     CASE 2: persist = true
  ============================*/
  if (isLoading) return <PulseLoader />;

  if (isError) {
    return (
      <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
        <span>{error?.data?.message}</span>
        <span>—</span>
        <span className="text-red-700 font-semibold underline">
          Redirecting to login...
        </span>
      </p>
    );
  }

  if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
    return <Outlet />;
  }

  return <PulseLoader />;
};

export default PersistLogin;
