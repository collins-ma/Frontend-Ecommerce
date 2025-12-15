import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const token = useSelector(selectCurrentToken); // check if token exists
    const { roles } = useAuth();

    const content = (
        !token
            ? <Navigate to="/login"  replace />
            : roles.some(role => allowedRoles.includes(role))
                ? <Outlet />
                : <Navigate to="/login" replace />
    );

    return content;
}

export default RequireAuth;
