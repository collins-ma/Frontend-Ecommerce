import { apiSlice } from "../../app/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";



const returnsAdapter = createEntityAdapter({
  selectId: (returnItem) => returnItem._id,

  sortComparer: (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
});


const initialState = returnsAdapter.getInitialState();



export const returnsApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({



    // ==========================
    // CUSTOMER REQUEST RETURN
    // ==========================




requestReturn: builder.mutation({

  query: ({ orderId, returnedItems }) => ({

    url: `/returns/orders/${orderId}/request`,

    method: "POST",

    body: {
      returnedItems,
    },

  }),

  invalidatesTags: [
    { type: "Return", id: "MY_RETURNS" },
    { type: "Order", id: "MY_ORDERS" },
  ],

}),

    // ==========================
    // CUSTOMER RETURNS
    // ==========================

    getMyReturns: builder.query({

      query: () => "/returns/my-returns",


      transformResponse: (responseData) => {

        return returnsAdapter.setAll(
          initialState,
          responseData
        );

      },


      providesTags: (result) =>

        result?.ids

        ?

        [

          ...result.ids.map((id)=>({

            type:"Return",

            id,

          })),

          {
            type:"Return",
            id:"MY_RETURNS"
          }

        ]

        :

        [

          {
            type:"Return",
            id:"MY_RETURNS"
          }

        ]

    }),






    // ==========================
    // SINGLE RETURN
    // ==========================

    getReturnById: builder.query({

      query:(id)=>`/returns/${id}`,


      providesTags:(result,error,id)=>[

        {
          type:"Return",
          id,
        }

      ]

    }),






    // ==========================
    // ADMIN ALL RETURNS
    // ==========================


    getAllReturns: builder.query({

      query:(status)=>({

        url:"/returns",

        params: status
        ?
        {
          status
        }
        :
        undefined

      }),


      transformResponse:(responseData)=>{

        return returnsAdapter.setAll(
          initialState,
          responseData.returns
        );

      },


      providesTags:(result)=>

      result?.ids

      ?

      [

        ...result.ids.map((id)=>({

          type:"Return",

          id,

        })),

        {
          type:"Return",
          id:"LIST"
        }

      ]

      :

      [

        {
          type:"Return",
          id:"LIST"
        }

      ]

    }),






    // ==========================
    // ADMIN APPROVE RETURN
    // ==========================


    approveReturn: builder.mutation({

      query:(id)=>({

        url:`/returns/${id}/approve`,

        method:"PATCH",

      }),


      invalidatesTags:(result,error,id)=>[

        {
          type:"Return",
          id
        },

        {
          type:"Return",
          id:"LIST"
        }

      ]

    }),








    // ==========================
    // ADMIN REJECT RETURN
    // ==========================


    rejectReturn: builder.mutation({

      query:({id,rejectedReason,adminNotes})=>({

        url:`/returns/${id}/reject`,

        method:"PATCH",

        body:{
          rejectedReason,
          adminNotes
        }

      }),


      invalidatesTags:(result,error,{id})=>[

        {
          type:"Return",
          id
        },

        {
          type:"Return",
          id:"LIST"
        }

      ]

    }),







    // ==========================
    // ADMIN RECEIVE ITEM
    // ==========================


    receiveReturnedItem: builder.mutation({

      query:({id,adminNotes})=>({

        url:`/returns/${id}/receive-item`,

        method:"PATCH",

        body:{
          adminNotes
        }

      }),


      invalidatesTags:(result,error,{id})=>[

        {
          type:"Return",
          id
        }

      ]

    }),








    // ==========================
    // ADMIN REFUND RETURN
    // ==========================


    refundReturn: builder.mutation({

      query:({
        id,
        refundChannel,
        transactionId
      })=>({

        url:`/returns/${id}/refund`,

        method:"PATCH",

        body:{
          refundChannel,
          transactionId
        }

      }),


      invalidatesTags:(result,error,{id})=>[

        {
          type:"Return",
          id
        },

        {
          type:"Order",
          id:"LIST"
        }

      ]

    }),



  }),



});






export const {


useRequestReturnMutation,

useGetMyReturnsQuery,

useGetReturnByIdQuery,

useGetAllReturnsQuery,

useApproveReturnMutation,

useRejectReturnMutation,

useReceiveReturnedItemMutation,

useRefundReturnMutation,


} = returnsApiSlice;