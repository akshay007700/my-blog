import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { NewsProvider } from "@/contexts/NewsContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="article/[id]" 
          options={{ 
            presentation: "card",
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="admin/login" 
          options={{ 
            presentation: "modal",
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="admin/dashboard" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="admin/edit/[id]" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="admin/ai-topics" 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminProvider>
          <NewsProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </NewsProvider>
        </AdminProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
