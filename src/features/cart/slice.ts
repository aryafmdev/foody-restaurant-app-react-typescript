import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '../../types/schemas';

type CartState = {
  items: MenuItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<MenuItem>) {
      state.items.push(action.payload);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addItem, clear } = cartSlice.actions;
export default cartSlice.reducer;
