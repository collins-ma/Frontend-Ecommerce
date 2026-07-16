import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  needsVerification: null,
  authError:null,
  isRefreshing:false

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

    setAuthError:(state,action)=>{
      state.authError=action.payload

    },
    clearAuthError:(state)=>{
      state.authError=null
    },
    setRefreshing:(state,action)=>{
      state.isRefreshing=action.payload
    }
  },
});

export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthError=(state)=>state.auth.authError
export const selectIsRefreshing = (state) => state.auth.isRefreshing;
export const selectNeedsVerification = (state) => state.auth.needsVerification;

export const { setCredentials, logOut,setAuthError,clearAuthError ,setRefreshing} = authSlice.actions;
export default authSlice.reducer;