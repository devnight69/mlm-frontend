import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Default is localStorage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./rootReducer";

// Persist configuration
const persistConfig = {
  key: "root", // Key to store data in storage
  storage, // Use localStorage
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To prevent issues with non-serializable data
    }),
});

export const persistor = persistStore(store);
export default store;
