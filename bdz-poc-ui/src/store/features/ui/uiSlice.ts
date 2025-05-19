import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store'; // Import RootState type

// Define a type for the slice state
interface UiState {
  isUserMenuOpen: boolean;
  // Add other UI related state here
}

// Define the initial state using that type
const initialState: UiState = {
  isUserMenuOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui', // Name of the slice
  initialState,
  reducers: {
    // Action to toggle the user menu
    toggleUserMenu: (state) => {
      state.isUserMenuOpen = !state.isUserMenuOpen;
    },
    // Example action with payload
    setUserMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isUserMenuOpen = action.payload;
    },
    // Add other reducers for UI actions here
  },
});

// Export the actions creators
export const { toggleUserMenu, setUserMenuOpen } = uiSlice.actions;

// Selector function to get the user menu state from the root state
export const selectIsUserMenuOpen = (state: RootState) => state.ui.isUserMenuOpen;

// Export the reducer
export default uiSlice.reducer; 