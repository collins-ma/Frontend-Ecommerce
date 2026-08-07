import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/apiSlice";

const notificationsAdapter = createEntityAdapter({
  selectId: (notification) => notification.id,

  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime(),
});

const initialState =
  notificationsAdapter.getInitialState();

export const notificationsApiSlice =
  apiSlice.injectEndpoints({
    endpoints: (builder) => ({

      // Get Notifications
      getNotifications: builder.query({
        query: () => "/notifications",

        transformResponse: (responseData) => {

          const loadedNotifications =
            responseData.map((notification) => {
              notification.id = notification._id;
              return notification;
            });

          return notificationsAdapter.setAll(
            initialState,
            loadedNotifications
          );
        },

        providesTags: (result) =>
          result?.ids
            ? [
                {
                  type: "Notification",
                  id: "LIST",
                },

                ...result.ids.map((id) => ({
                  type: "Notification",
                  id,
                })),
              ]
            : [
                {
                  type: "Notification",
                  id: "LIST",
                },
              ],

        keepUnusedDataFor: 60,
      }),

      // Mark one notification as read
      markAsRead: builder.mutation({
        query: (notificationId) => ({
          url: `/notifications/${notificationId}/read`,
          method: "PATCH",
        }),

        invalidatesTags: (result, error, notificationId) => [
          {
            type: "Notification",
            id: notificationId,
          },
        ],
      }),

      // Mark all notifications as read
      markAllAsRead: builder.mutation({
        query: () => ({
          url: "/notifications/read-all",
          method: "PATCH",
        }),

        invalidatesTags: [
          {
            type: "Notification",
            id: "LIST",
          },
        ],
      }),

    }),
  });

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApiSlice;

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
  selectEntities: selectNotificationEntities,
  selectTotal: selectTotalNotifications,
} = notificationsAdapter.getSelectors();