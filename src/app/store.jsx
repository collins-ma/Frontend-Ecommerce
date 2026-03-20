import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "../auth/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),

      devTools:import.meta.env.MODE !== "production"
  });

  setupListeners(store.dispatch);