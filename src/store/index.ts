import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import heritageReducer from "./slices/heritageSlice";
import gameReducer from "./slices/gameSlice";

// Initially syncing core slices. Add more as needed.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    heritage: heritageReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
