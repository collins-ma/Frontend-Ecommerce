import { apiSlice } from '../../app/apiSlice';
import { createEntityAdapter } from '@reduxjs/toolkit';

const categoriesAdapter = createEntityAdapter({
  selectId: (category) => category._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = categoriesAdapter.getInitialState();

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      transformResponse: (responseData) => categoriesAdapter.setAll(initialState, responseData),
      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;