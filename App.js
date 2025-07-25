import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import RootNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';

// Initialize a single React Query client for the entire app
const queryClient = new QueryClient();

/**
 * Entry point for the Old Head application.  Wraps the navigation and
 * authentication providers together so that they are available to every
 * component in the application.  The QueryClientProvider gives access to
 * react‑query hooks for caching and synchronizing remote data.
 */
export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </AuthProvider>
  );
}