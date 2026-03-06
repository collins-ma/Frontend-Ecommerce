import { apiSlice } from "../app/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username, password },
      }),
    }),

  
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        const { accessToken } = data;

        dispatch(setCredentials({ accessToken }));
      },
    }),

    
    register: builder.mutation({
      query: ({ username, email, phoneNumber, password }) => ({
        url: "/users",
        method: "POST",
        body: { username, email, phoneNumber, password },
      }),
    }),

    
    onSendLogout: builder.mutation({
      query: () => ({
        url: "/sessions/logout-current",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        
        dispatch(logOut());

        dispatch(apiSlice.util.resetApiState());
      },
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useOnSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice;