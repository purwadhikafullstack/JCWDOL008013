import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { orderUserReducer } from "./orderUserReducer";


export const globalStore = configureStore({
  // memasukkan reducer yang dibutuhkan
  reducer: {
    userReducer,
    orderUserReducer
  },
});
