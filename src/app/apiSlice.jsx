import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../auth/authSlice";
import { getNavigate } from "../utils/navigation";


const baseQuery = fetchBaseQuery({
  baseUrl: "https://shopvista-q42b.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});


const baseQueryWithReauth = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);

  
  if (result?.error?.status === 403) {
  
    const refreshResult = await baseQuery('auth/refresh',api,extraOptions)

    
    if (refreshResult?.data) {
     

      
      api.dispatch(setCredentials(refreshResult.data));


      return await baseQuery(args, api, extraOptions);
    }

    api.dispatch(logOut());

    setTimeout(() => {
      const navigate = getNavigate(); 

      if (navigate) navigate("/login");
    }, 2000);
  
    return {
      error: {
        data: { message: "your login has expired. Please log in again." },
    
      },
      
    };
  }

  return result;
};


export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ["User", "Order", "Cart", "Users"],
});
