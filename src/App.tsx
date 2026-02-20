import type { FC } from "react";
import { RouterProvider } from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./features/auth/providers/user-auth.provider";

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
        <RouterProvider />
      </UserAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
