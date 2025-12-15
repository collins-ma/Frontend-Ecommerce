import { apiSlice } from "../../app/apiSlice";



export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      initiatePayment: builder.mutation({
        query: (payload) => ({
          url: '/payments/initiate',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Cart'], // refetch cart if needed after payment
      }),
    }),
    overrideExisting: false,
  });
  
  export const { useInitiatePaymentMutation } = paymentApiSlice;