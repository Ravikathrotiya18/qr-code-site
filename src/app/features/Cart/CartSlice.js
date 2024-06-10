import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { itemName, quantity, itemDetails, variantDetails, mealType } = action.payload;
      console.log('carSlice',quantity)
      const existingItemIndex = state.items.findIndex(item =>
        item.itemName === itemName &&
        JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails) &&
        item.mealType === mealType
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity = quantity;
      } else if (quantity > 0) {
        state.items.push({ itemName, quantity, itemDetails, variantDetails, mealType });
      }

      state.items = state.items.filter(item => item.quantity > 0);

      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    removeItem(state, action) {
      const { itemName, variantDetails, mealType } = action.payload;
      state.items = state.items.filter(item =>
        !(item.itemName === itemName &&
          JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails) &&
          item.mealType === mealType)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },

    updateQuantity(state, action) {
      const { itemName, quantity, variantDetails, mealType } = action.payload;
      const existingItemIndex = state.items.findIndex(item =>
        item.itemName === itemName &&
        JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails) &&
        item.mealType === mealType
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

    editItem(state, action) {
      const { prevItem, newItem } = action.payload;
      const { itemName: prevItemName, variantDetails: prevVariantDetails, mealType: prevMealType } = prevItem;
      const { itemName: newItemName, quantity: newQuantity, variantDetails: newVariantDetails, mealType: newMealType } = newItem;

      const prevItemIndex = state.items.findIndex(item =>
        item.itemName === prevItemName &&
        JSON.stringify(item.variantDetails) === JSON.stringify(prevVariantDetails) &&
        item.mealType === prevMealType
      );

      if (prevItemIndex !== -1) {
        const existingNewItemIndex = state.items.findIndex(item =>
          item.itemName === newItemName &&
          JSON.stringify(item.variantDetails) === JSON.stringify(newVariantDetails) &&
          item.mealType === newMealType
        );

        if (existingNewItemIndex !== -1) {
          state.items[existingNewItemIndex].quantity += newQuantity;
          state.items.splice(prevItemIndex, 1);
        } else {
          state.items[prevItemIndex] = {
            ...state.items[prevItemIndex],
            itemName: newItemName,
            quantity: newQuantity,
            variantDetails: newVariantDetails,
            mealType: newMealType,
          };
        }
        state.items = state.items.filter(item => item.quantity > 0);
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },    
    updateMultipleQuantities(state, action) {
      const updatedItems = action.payload;
      updatedItems?.forEach(updatedItem => {
        const { itemName, quantity, variantDetails, mealType } = updatedItem;
        const existingItemIndex = state.items.findIndex(item =>
          item.itemName === itemName &&
          JSON.stringify(item.variantDetails) === JSON.stringify(variantDetails) &&
          item.mealType === mealType
        );

        if (existingItemIndex !== -1) {
          if (quantity === 0) {
            state.items.splice(existingItemIndex, 1);
          } else {
            state.items[existingItemIndex].quantity = quantity;
          }
        }
      });

      const itemsWithNonZeroQuantity = state.items.filter(item => item.quantity > 0);
      localStorage.setItem('cartItems', JSON.stringify(itemsWithNonZeroQuantity));
    }
  },
});

export const { addItem, updateQuantity, removeItem, editItem, updateMultipleQuantities } = cartSlice.actions;

const storedItems = localStorage.getItem('cartItems');
if (storedItems) {
  initialState.items = JSON.parse(storedItems);
}

export const selectCartItems = state => state.cart.items;

export default cartSlice.reducer;
