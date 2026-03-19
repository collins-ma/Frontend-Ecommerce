import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  needsVerification: null,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      
      if (action.payload.needsVerification) {
        state.needsVerification = { email: action.payload.email };
        state.token = null; 
      } else {
        state.token = action.payload.accessToken;
        state.needsVerification = null
      }
    },
    logOut: (state) => {
      state.token = null;
      state.needsVerification = null; 
    },
  },
});

export const selectCurrentToken = (state) => state.auth.token;
export const selectNeedsVerification = (state) => state.auth.needsVerification;

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;