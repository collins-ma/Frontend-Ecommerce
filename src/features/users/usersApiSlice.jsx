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
      transformResponse: (responseData) =>
        usersAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: "Users", id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // Fetch single user
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
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

    // Verify user account
    verifyAccount: builder.mutation({
      query: (body) => ({
        url: "/users/verify",
        method: "POST",
        body,
      }),
    }),

    // Resend verification code
    resendCode: builder.mutation({
      query: (body) => ({
        url: "/users/resend-code",
        method: "POST",
        body,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    // Change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: data,
      }),
    }),

    // Deactivate user
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Activate user
    activateUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Update user (username and email)
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
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,   // <-- added for updating username/email
  useVerifyAccountMutation,
  useResendCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useChangePasswordMutation,
} = usersApiSlice;