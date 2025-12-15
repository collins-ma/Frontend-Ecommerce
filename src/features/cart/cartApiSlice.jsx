import { apiSlice } from '../../app/apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'], // ✅ allows cache invalidation
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'], // ✅ triggers refetch of getCart
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`, // your backend route for removing an item
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'], // ✅ triggers refetch of getCart
    }),
    // Optional: you can add updateItem, clearCart, etc.
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation, // ✅ export the remove mutation hook
} = cartApiSlice;
