import { configureStore } from '@reduxjs/toolkit'
import auth from '../features/auth/slice'
import cart from '../features/cart/slice'

export const store = configureStore({
  reducer: {
    auth,
    cart,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
