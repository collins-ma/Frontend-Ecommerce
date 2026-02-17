import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  needsVerification: null, // NEW: store unverified flag & email
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // If login response has needsVerification
      if (action.payload.needsVerification) {
        state.needsVerification = { email: action.payload.email };
        state.token = null; // no token yet
      } else {
        state.token = action.payload.accessToken;
        state.needsVerification = null; // clear if previously unverified
      }
    },
    logOut: (state) => {
      state.token = null;
      state.needsVerification = null; // also clear unverified info
    },
  },
});

export const selectCurrentToken = (state) => state.auth.token;
export const selectNeedsVerification = (state) => state.auth.needsVerification;

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;