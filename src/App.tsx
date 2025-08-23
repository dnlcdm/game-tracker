import type { FC } from "react";
import { RouterProvider } from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />;
    </QueryClientProvider>
  );
};

export default App;
