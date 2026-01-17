import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import heritageReducer from "./slices/heritageSlice";
import gameReducer from "./slices/gameSlice";
import notificationReducer from "./slices/notificationSlice";
import settingsReducer from "./slices/settingsSlice";

// Initially syncing core slices. Add more as needed.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    heritage: heritageReducer,
    game: gameReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
