import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  loading: true,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    logoutUser(state) {
      state.user = null;
      state.loading = false;
    },
  },
});
export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
