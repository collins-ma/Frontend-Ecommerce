import { apiSlice } from "../../app/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";


const wishlistAdapter = createEntityAdapter({
  selectId: (product) => product._id,
});


const initialState = wishlistAdapter.getInitialState();



export const wishlistApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({


    // GET USER WISHLIST
    getMyWishlist: builder.query({

      query: () => "/wishlist",

      transformResponse: (responseData) => {
  return wishlistAdapter.setAll(
    initialState,
    responseData.products || []
  );
},

    


      providesTags:(result)=>


      result?.ids

      ?

      [
        ...result.ids.map(id=>({
          type:"Wishlist",
          id
        })),

        {
          type:"Wishlist",
          id:"LIST"
        }
      ]

      :

      [
        {
          type:"Wishlist",
          id:"LIST"
        }
      ]

    }),






    // ADD PRODUCT
    addToWishlist: builder.mutation({

      query:(productId)=>({

          url: `/wishlist/${productId}`,
        method:"POST",

        body:{
          productId
        }

      }),


      invalidatesTags:[
        {
          type:"Wishlist",
          id:"LIST"
        }
      ]

    }),



emptyWishlist: builder.mutation({

    query: () => ({
        url: "/wishlist",
        method: "DELETE"
    }),

    invalidatesTags: [
        {
            type: "Wishlist",
            id: "LIST"
        }
    ]

}),







    // REMOVE PRODUCT

    removeFromWishlist: builder.mutation({

      query:(productId)=>({

        url:`/wishlist/${productId}`,

        method:"DELETE"

      }),


      invalidatesTags:[
        {
          type:"Wishlist",
          id:"LIST"
        }
      ]

    })





  })

});





export const {

useGetMyWishlistQuery,

useAddToWishlistMutation,

useRemoveFromWishlistMutation,

useEmptyWishlistMutation


}=wishlistApiSlice;