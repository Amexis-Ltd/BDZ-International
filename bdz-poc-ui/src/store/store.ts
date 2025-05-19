import { configureStore } from '@reduxjs/toolkit';
// Import the reducer from the ui slice
import uiReducer from './features/ui/uiSlice';
import authReducer from './features/auth/authSlice'; // Import the auth reducer
import shiftReducer from './features/shift/shiftSlice';
import ticketReducer from './features/ticket/ticketSlice';
// We will import reducers from feature slices here later
// import rootReducer from './rootReducer'; // Example if using combineReducers explicitly

export const store = configureStore({
  reducer: {
    // Add the ui reducer to the store under the 'ui' key
    ui: uiReducer,
    auth: authReducer, // Add the auth reducer
    shift: shiftReducer,
    ticket: ticketReducer,
    // Add other reducers from your features slices here
    // Example: tickets: ticketsReducer,
  },
  // Middleware is automatically configured by configureStore (includes thunk)
  // DevTools Extension integration is also enabled by default
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {ui: UiState, auth: AuthState}
export type AppDispatch = typeof store.dispatch; 