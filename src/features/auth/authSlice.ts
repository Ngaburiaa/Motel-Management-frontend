import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthProps {
  firstName: string | null;
  email: string | null;
  token: string | null;
  userId: number | null;
  userType: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthProps = {
  firstName: null,
  email: null,
  token: null,
  userId: null,
  userType: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    persistCredentials: (state, action: PayloadAction<AuthProps>) => {
      state.firstName = action.payload.firstName;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;

      // Store in localStorage
      localStorage.setItem("token", action.payload.token || "");
    },
    clearCredentials: (state) => {
      state.firstName = null;
      state.email = null;
      state.token = null;
      state.userId = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
  },
});

export const { persistCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
