import { createBrowserRouter, RouterProvider as RP } from "react-router";
import SearchGames from "../pages/search-games";

export const RouterProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <p>home</p>,
    },
    {
      path: "/search",
      element: <SearchGames />,
    },
  ]);

  return <RP router={router} />;
};
