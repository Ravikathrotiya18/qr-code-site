import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { itemName, quantity, itemDetails, variantDetails } = action.payload;
      const existingItemIndex = state.items.findIndex(item => 
        item.itemName === itemName &&
        JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails)
      );
    
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += 1;
      } else if (quantity > 0) {
        state.items.push({ itemName, quantity, itemDetails, variantDetails });
      }
    
      state.items = state.items.filter(item => item.quantity > 0);
    
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    removeItem(state, action) {
      const { itemName, variantDetails } = action.payload;
      state.items = state.items.filter(item => 
        !(item.itemName === itemName && JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails))
      );
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    updateQuantity(state, action) {
      const { itemName, quantity, variantDetails } = action.payload;
      // console.log('itemName',itemName,'quantity',quantity,'variantDatails',variantDetails)
      const existingItemIndex = state.items.findIndex(item => 
        item.itemName === itemName && JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails)
      );

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

const storedItems = localStorage.getItem('cartItems');
if (storedItems) {
  initialState.items = JSON.parse(storedItems);
}

export const selectCartItems = state => state.cart.items;

export default cartSlice.reducer;
