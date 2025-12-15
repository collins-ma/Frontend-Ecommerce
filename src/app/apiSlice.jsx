import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../auth/authSlice";
import { getNavigate } from "../utils/navigation";

// ------------------------------
// GLOBAL REFRESH LOCK
// ------------------------------


// ------------------------------
// BASE QUERY
// ------------------------------
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ------------------------------
// WRAPPED BASE QUERY WITH REAUTH
// ------------------------------
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // 1️⃣ First, try the normal request
  let result = await baseQuery(args, api, extraOptions);

  // 2️⃣ Access token expired → try refresh
  if (result?.error?.status === 403) {
    console.log("⚠️ 403 detected → attempting token refresh...");

   
    // 4️⃣ Wait for refresh result
    const refreshResult = await baseQuery('auth/refresh',api,extraOptions)

    // --------------------------
    // REFRESH SUCCESS
    // --------------------------
    if (refreshResult?.data) {
      console.log("✅ Token refresh successful");

      // Store new tokens
      api.dispatch(setCredentials(refreshResult.data));

      // Retry original request
      return await baseQuery(args, api, extraOptions);
    }

    // --------------------------
    // REFRESH FAILED → LOGOUT
    // --------------------------
    console.log("❌ Refresh failed → logging out");

    // Save user's last page so they return after login
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);

   

    api.dispatch(logOut());

    setTimeout(() => {
      const navigate = getNavigate(); 

      if (navigate) navigate("/login");
    }, 2000);
  
    return {
      error: {
        data: { message: "Session expired. Please log in again." },
    
      },
      
    };
  }

  return result;
};

// ------------------------------
// API SLICE
// ------------------------------
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["User", "Order", "Cart", "Users"],
});
