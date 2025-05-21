import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import { useColorScheme } from '@/hooks/useColorScheme';
import NoNetwork from './screen/NoNetwork';
import "../global.css";
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    UrbanistBold: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    PatrickHand: require('@/assets/fonts/Patrick_Hand/PatrickHand-Regular.ttf'),
    Ubuntu: require('@/assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
    Poppins: require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    Roboto: require('@/assets/fonts/Roboto/static/Roboto-Regular.ttf'),
    Inter: require('@/assets/fonts/Inter/static/Inter_18pt-Regular.ttf'),
    Work_Sans: require('@/assets/fonts/Work_Sans/static/WorkSans-Regular.ttf'),  
  });

  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // Listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    // Check initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  // Show NoNetwork screen if there is no internet connection
  if (isConnected === false) {
    return <NoNetwork />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Toast />
        </QueryClientProvider>
    </ThemeProvider>
  );
}