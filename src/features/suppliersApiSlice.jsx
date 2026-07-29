
import { createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../app/apiSlice";

const suppliersAdapter = createEntityAdapter({
  selectId: (supplier) => supplier._id,
  sortComparer: (a, b) =>
    a.companyName.localeCompare(b.companyName),
});

const initialState = suppliersAdapter.getInitialState();

export const suppliersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getSuppliers: builder.query({
      query: () => "/suppliers",

      transformResponse: (responseData) =>
        suppliersAdapter.setAll(
          initialState,
          responseData,
        ),

      providesTags: (result) =>
        result?.ids
          ? [
              ...result.ids.map((id) => ({
                type: "Supplier",
                id,
              })),
              {
                type: "Supplier",
                id: "LIST",
              },
            ]
          : [
              {
                type: "Supplier",
                id: "LIST",
              },
            ],
    }),


getSupplierById: builder.query({

  query:(id)=> `/suppliers/${id}`,

  providesTags:(result,error,id)=>[
    {
      type:"Supplier",
      id
    }
  ]

}),


    createSupplier: builder.mutation({
      query: (supplier) => ({
        url: "/suppliers",
        method: "POST",
        body: supplier,
      }),

      invalidatesTags: [
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),

    updateSupplier: builder.mutation({
      query: ({ id, ...supplier }) => ({
        url: `/suppliers/${id}`,
        method: "PATCH",
        body: supplier,
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "Supplier",
          id,
        },
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),

    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        {
          type: "Supplier",
          id,
        },
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),

  }),
});

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSupplierByIdQuery
} = suppliersApiSlice;