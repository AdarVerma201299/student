// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import paymentReducer from "./slices/paymentSlice";
import studentReducer from "./slices/studentSlice";
import adminReducer from "./slices/adminSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
  student: studentReducer,
  admin: adminReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "student"], // only persist the auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

const checkPersistedData = () => {
  const rawData = localStorage.getItem("persist:root");
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      console.log("Parsed localStorage data:", parsed);
      if (parsed.auth) {
        console.log("Auth slice:", JSON.parse(parsed.auth)); // Should now show auth data
        console.log("Student slice:", JSON.parse(parsed.student)); // Should now show auth data
        console.log("Admin slice:", JSON.parse(parsed.admin)); // Should now show auth data
      }
    } catch (e) {
      console.error("Parsing error:", e);
    }
  } else {
    console.log("No data in persist:root");
  }
};
checkPersistedData();
