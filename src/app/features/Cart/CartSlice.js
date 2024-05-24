import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { itemIndex, quantity, itemDetails } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.itemIndex === itemIndex);

      if (existingItemIndex !== -1) {
        if (quantity === 0) {
          // If quantity is 0, remove the item from state
          state.items.splice(existingItemIndex, 1);
        } else {
          // Update the quantity of the existing item
          state.items[existingItemIndex].quantity = quantity;
        }
      } else if (quantity > 0) {
        // Add new item only if quantity is greater than 0
        state.items.push({ itemIndex, quantity, itemDetails });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItem(state, action) {
      const { itemIndex } = action.payload;
      state.items = state.items.filter(item => item.itemIndex !== itemIndex);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const { itemIndex, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.itemIndex === itemIndex);
      
      if (existingItemIndex !== -1) {
        if (quantity === 0) {
          state.items.splice(existingItemIndex, 1);
        } else {
          state.items[existingItemIndex].quantity = quantity;
        }
        const itemsWithNonZeroQuantity = state.items.filter(item => item.quantity > 0);
        localStorage.setItem('cartItems', JSON.stringify(itemsWithNonZeroQuantity));
      }
    },
  },
});

export const { addItem, updateQuantity, removeItem } = cartSlice.actions;

// Load cart items from local storage on app load
const storedItems = localStorage.getItem('cartItems');
if (storedItems) {
  initialState.items = JSON.parse(storedItems);
}

export const selectCartItems = state => state.cart.items;

export default cartSlice.reducer;
