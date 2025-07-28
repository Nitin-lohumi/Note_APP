import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./Slices/UserSlices";
export const store = configureStore({
  reducer: {
    user: useReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDisPatch = typeof store.dispatch;
