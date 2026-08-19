import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';
import { bootstrapAuth } from './src/store/slices/authSlice';

function AppBootstrap() {
  useEffect(() => {
    store.dispatch(bootstrapAuth());
  }, []);

  return <RootNavigator />;
}

function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AppBootstrap />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
