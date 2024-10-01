import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// reducer import
import customizationReducer from "./customizationReducer";
import dashboardSlice from "./slices/dashboardSlice";

// ==============================|| COMBINE REDUCER ||============================== //

const persistConfig = {
  key: "DataPersisted",
  storage,
};

const reducer = combineReducers({
  DashboardPersist: persistReducer(persistConfig, dashboardSlice), // Persisted reducer
  DashboardSlice: dashboardSlice, // Non-persisted reducer
  customization: customizationReducer, // Non-persisted reducer
});

export default reducer;
