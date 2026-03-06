import { apiSlice } from '../../app/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const productsAdapter = createEntityAdapter({
  selectId: (product) => product._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = productsAdapter.getInitialState();

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch products, optionally filtered by category
    getProducts: builder.query({
      query: (category) => (category ? `/products?category=${category}` : '/products'),
      transformResponse: (responseData) => {
        return productsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // ✅ Create product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/products/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = productsApiSlice;