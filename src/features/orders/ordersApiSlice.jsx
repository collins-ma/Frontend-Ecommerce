import { apiSlice } from '../../app/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

// Create entity adapter for orders
const ordersAdapter = createEntityAdapter({
  selectId: (order) => order._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

// Initial state
const initialState = ordersAdapter.getInitialState();

// Inject endpoints into apiSlice
export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all orders (admin)
    getOrders: builder.query({
      query: () => '/orders',
      transformResponse: (responseData) => {
        return ordersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Fetch orders of logged-in user
    getMyOrders: builder.query({
      query: () => '/orders/my',
      transformResponse: (responseData) => {
        return ordersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({ type: 'Order', id })),
              { type: 'Order', id: 'MY_ORDERS' },
            ]
          : [{ type: 'Order', id: 'MY_ORDERS' }],
    }),

    // Fetch single order by ID
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Mutation to update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,      // admin: all orders
  useGetMyOrdersQuery,    // regular user: only their orders
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice;
