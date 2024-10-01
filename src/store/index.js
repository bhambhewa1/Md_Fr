import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { persistStore } from "redux-persist";

// ==============================|| REDUX - MAIN STORE ||============================== //

// Create the Redux store
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persisted store
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };
