import React, {useEffect} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Provider, useDispatch, useSelector} from "react-redux";
import {store, RootState} from "./store";
import {initializeAuth} from "./store/slices/authSlice";
import RootNavigator from "./navigation/RootNavigator";

const AppContent = () => {
  const dispatch = useDispatch<any>();
  const {isAuthenticated, isInitialized} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
      return null; // Or a splash screen
  }

  return <RootNavigator isAuthenticated={isAuthenticated} />;
};

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
