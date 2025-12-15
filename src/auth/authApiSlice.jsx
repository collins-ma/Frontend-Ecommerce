import { apiSlice } from "../app/apiSlice";
import { logOut ,setCredentials} from "./authSlice"; // your auth reducer logout action


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
          url: '/auth/refresh',
          method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
           const {data}  =  await queryFulfilled
           const {accessToken}=data
             
              dispatch(setCredentials({ accessToken }))
          } catch (err) {
              console.log(err)
          }
      }
  }),
    register: builder.mutation({
      query: ({ username, email, phoneNumber, password }) => ({
        url: "/users",
        method: "POST",
        body: { username, email, phoneNumber, password },
      }),
    }),

    
   

    OnsendLogout: builder.mutation({
      query: () => ({
        url: "/sessions/logout-current",
        method: "POST", // or GET depending on backend
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
         await queryFulfilled; 
       
        
        dispatch(logOut());
          
      
          dispatch(apiSlice.util.resetApiState())
      
        
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useOnsendLogoutMutation,
  useRefreshMutation
  
} = authApiSlice;
