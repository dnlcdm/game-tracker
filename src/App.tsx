import type { FC } from "react";
import { RouterProvider } from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/providers/auth.provider";
import { UserAuthProvider } from "./features/auth/providers/user-auth.provider";

const queryClient = new QueryClient();

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
