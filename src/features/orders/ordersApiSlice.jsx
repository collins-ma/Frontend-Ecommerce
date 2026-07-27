import { apiSlice } from '../../app/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';



const ordersAdapter = createEntityAdapter({
  selectId: (order) => order._id,
  sortComparer: (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
});

const initialState = ordersAdapter.getInitialState();


export const ordersApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({

    // ==========================
    // ADMIN ALL ORDERS
    // ==========================
    getOrders: builder.query({

      query: () => "/orders",

      transformResponse: (responseData) => {
        return ordersAdapter.setAll(
          initialState,
          responseData
        );
      },

      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({
                type: "Order",
                id,
              })),
              {
                type: "Order",
                id: "LIST",
              },
            ]
          : [
              {
                type: "Order",
                id: "LIST",
              },
            ],
    }),



    // ==========================
    // CUSTOMER ORDERS
    // ==========================
    getMyOrders: builder.query({

      query: () => "/orders/my",

      transformResponse: (responseData) => {

        return ordersAdapter.setAll(
          initialState,
          responseData
        );

      },

      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({
                type: "Order",
                id,
              })),

              {
                type: "Order",
                id: "MY_ORDERS",
              },
            ]
          : [
              {
                type: "Order",
                id: "MY_ORDERS",
              },
            ],
    }),



    cancelOrder: builder.mutation({

  query: ({id, reason}) => ({
    url:`/orders/${id}/cancel`,
    method:"PATCH",
    body:{
      reason
    }
  }),


  invalidatesTags:(result,error,{id})=>[
    {
      type:"Order",
      id
    },
    {
      type:"Order",
      id:"MY_ORDERS"
    }
  ]

}),



    // ==========================
    // SINGLE ORDER DETAILS
    // ==========================
    getOrderById: builder.query({

      query: (id) => `/orders/${id}`,

      // NO transformResponse here
      // Backend already returns one object

      providesTags: (result, error, id) => [
        {
          type: "Order",
          id,
        },
      ],

    }),



    getTodaySales: builder.query({
      query: () => "/analytics/today-sales",
      providesTags: ["Analytics"],
    }),



    getWeeklySales: builder.query({
      query: () => "/analytics/weekly-sales",
      providesTags: ["Analytics"],
    }),

    // ==========================
    // ORDER STATUS POLLING
    // ==========================
    getOrderStatus: builder.query({

      query: (id) => `/orders/${id}/status`,

      providesTags: (result, error, id) => [
        {
          type: "Order",
          id,
        },
      ],

    }),


    recordCashPayment: builder.mutation({
  query: (id) => ({
    url: `/orders/${id}/record-cash-payment`,
    method: "PATCH",
  }),

  invalidatesTags: (result, error, id) => [
    { type: "Order", id },
    { type: "Order", id: "LIST" },
  ],
}),


recordMpesaPayment: builder.mutation({
  query: ({ id, transactionId }) => ({
    url: `/orders/${id}/record-mpesa-payment`,
    method: "PATCH",
    body: {
      transactionId,
    },
  }),

  invalidatesTags: (result, error, { id }) => [
    { type: "Order", id },
    { type: "Order", id: "LIST" },
  ],
}),



completeRefund: builder.mutation({
  query: ({ id, refundChannel, transactionId }) => ({
    url: `/orders/${id}/complete-refund`,
    method: "PATCH",
    body: {
      refundChannel,
      transactionId,
    },
  }),

  invalidatesTags: (result, error, { id }) => [
    { type: "Order", id },
    { type: "Order", id: "LIST" },
  ],
}),

    // ==========================
    // UPDATE ORDER STATUS
    // ==========================
    updateOrderStatus: builder.mutation({

      query: ({ id, status }) => ({

        url: `/orders/${id}/status`,

        method: "PATCH",

        body: {
          status,
        },

      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "Order",
          id,
        },
      ],

    }),


  }),

});



export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderStatusQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  
    useRecordCashPaymentMutation,
useGetTodaySalesQuery,
useGetWeeklySalesQuery,
  useRecordMpesaPaymentMutation,

  useCompleteRefundMutation,


} = ordersApiSlice;