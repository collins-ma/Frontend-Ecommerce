import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from '../hooks/useAuth'
import React from 'react'
import { useSelector } from "react-redux"
import { selectCurrentToken } from "../auth/authSlice"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()
    const token = useSelector(selectCurrentToken)

    // 🧠 Wait for auth to be ready
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    

    return (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}
export default RequireAuth