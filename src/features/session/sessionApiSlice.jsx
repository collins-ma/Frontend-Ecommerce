// features/sessions/sessionsApiSlice.js
import { apiSlice } from "../../app/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

// Normalize sessions
const sessionsAdapter = createEntityAdapter({
  selectId: (session) => session.sessionId,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

const initialState = sessionsAdapter.getInitialState();

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------
    // GET ALL SESSIONS
    // -----------------------------
    getSessions: builder.query({
      query: () => "/sessions",

      transformResponse: (responseData) => {
        return sessionsAdapter.setAll(initialState, responseData);
      },

      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: "Sessions", id })),
              { type: "Sessions", id: "LIST" },
            ]
          : [{ type: "Sessions", id: "LIST" }],
    }),

    // -----------------------------
    // LOGOUT SELECTED SESSIONS
    // -----------------------------
    logoutSelected: builder.mutation({
      query: ({ sessionIds }) => ({
        url: "/sessions/logout-selected",
        method: "DELETE",
        body: { sessionIds },
      }),

      invalidatesTags: (result, error, { sessionIds }) => [
        ...sessionIds.map((id) => ({ type: "Sessions", id })),
        { type: "Sessions", id: "LIST" },
      ],
    }),

    // -----------------------------
    // LOGOUT ALL SESSIONS
    // -----------------------------
    logoutAll: builder.mutation({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),

      invalidatesTags: [{ type: "Sessions", id: "LIST" }],
    }),

})
   

  
});

// Hooks
export const {
  useGetSessionsQuery,
  useLogoutSelectedMutation,
  useLogoutAllMutation,
  useLogoutCurrentMutation,
} = sessionsApiSlice;
