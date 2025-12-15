import { apiSlice } from "../../app/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

// Entity adapter for normalized users
const usersAdapter = createEntityAdapter({
  selectId: (user) => user._id,
  sortComparer: (a, b) => a.username.localeCompare(b.username),
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all users
    getUsers: builder.query({
      query: () => "/users",
      
      transformResponse: (responseData) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: "Users", id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // Fetch single user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      transformResponse: (responseData) => responseData, // single user, no adapter
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    verifyAccount: builder.mutation({
      query: (body) => ({
        url: "/users/verify",
        method: "POST",
        body,
      }),
    }),

    resendCode:builder.mutation({
      query:(body)=>({
        url:'users/resend-code',
        method:'POST',
        body,
      })
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useVerifyAccountMutation,
  useResendCodeMutation,
  useForgotPasswordMutation,
  

} = usersApiSlice;
