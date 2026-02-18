import type { FC } from "react";
import { RouterProvider } from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./features/auth/providers/user-auth.provider";
import { AuthProvider } from "./features/auth/providers/use-auth-igdb";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </UserAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
