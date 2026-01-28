import type { FC } from "react";
import { RouterProvider } from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./features/auth/providers/user-auth.provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (Snappy Navigation)
      gcTime: 1000 * 60 * 60, // 1 hour (Memory retention)
      refetchOnWindowFocus: false, // Don't refetch on tab switch (Personal data)
      retry: 1, // Fail fast on errors
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <RouterProvider />
      </UserAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
