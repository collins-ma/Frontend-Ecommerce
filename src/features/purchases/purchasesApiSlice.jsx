import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/apiSlice";

const purchasesAdapter = createEntityAdapter({
  selectId: (purchase) => purchase._id,
  sortComparer: (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
});

const initialState = purchasesAdapter.getInitialState();

export const purchasesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getPurchases: builder.query({
      query: () => "/purchases",

      transformResponse: (responseData) => {
        return purchasesAdapter.setAll(
          initialState,
          responseData,
        );
      },

      providesTags: (result) =>
        result?.ids
          ? [
              { type: "Purchase", id: "LIST" },
              ...result.ids.map((id) => ({
                type: "Purchase",
                id,
              })),
            ]
          : [{ type: "Purchase", id: "LIST" }],
    }),

    getPurchaseById: builder.query({
      query: (id) => `/purchases/${id}`,

      providesTags: (result, error, id) => [
        { type: "Purchase", id },
      ],
    }),

    createPurchase: builder.mutation({
      query: (data) => ({
        url: "/purchases",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [
        { type: "Purchase", id: "LIST" },
      ],
    }),

    receivePurchase: builder.mutation({
      query: (id) => ({
        url: `/purchases/${id}/receive`,
        method: "PATCH",
      }),

      invalidatesTags: (result, error, id) => [
        { type: "Purchase", id },
        { type: "Purchase", id: "LIST" },
        { type: "Product", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useReceivePurchaseMutation,
} = purchasesApiSlice;

export const selectPurchasesResult =
  purchasesApiSlice.endpoints.getPurchases.select();

const selectPurchasesData = (state) =>
  selectPurchasesResult(state)?.data ?? initialState;

export const {
  selectAll: selectAllPurchases,
  selectById: selectPurchaseById,
  selectIds: selectPurchaseIds,
} = purchasesAdapter.getSelectors(
  (state) => selectPurchasesData(state),
);