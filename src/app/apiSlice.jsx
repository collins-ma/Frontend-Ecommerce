import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../auth/authSlice";
import { getNavigate } from "../utils/navigation";

// Base query
const baseQuery = fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized (token expired or invalid)
  if (result?.error?.status === 403) {

    // 🔹 Save current page to localStorage before redirecting
    if (window.location.pathname !== "/login") {
      localStorage.setItem("lastPage", window.location.pathname);
    }

    // Attempt refresh token
    const refreshResult = await baseQuery("auth/refresh", api, extraOptions);
    

    if (refreshResult?.data) {
      
      // Update Redux store with new access token
      api.dispatch(setCredentials(refreshResult.data));

      // Retry original request
      return await baseQuery(args, api, extraOptions);
    }

    // Refresh failed → log out
    api.dispatch(logOut());

    // // Redirect to login
    const navigate = getNavigate();
    if (navigate) navigate("/login");
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["User", "Order", "Cart", "Users"],
});