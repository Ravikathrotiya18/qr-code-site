import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/Cart/CartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
})