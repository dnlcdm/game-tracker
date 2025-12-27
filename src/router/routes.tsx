import {
  createBrowserRouter,
  Navigate,
  RouterProvider as RP,
} from "react-router";
import { LoginCard } from "../features/login/login";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import Backlog from "../pages/backlog-page";
import { MainLayout } from "../features/sidebar";
import SearchGames from "../pages/search-games-page";
import Playing from "../pages/playing-page";
import { StatsTable } from "../features/game-stats/game-stats";

export const RouterProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/search" />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { path: "/backlog", element: <Backlog /> },
            { path: "/search", element: <SearchGames /> },
            { path: "/playing", element: <Playing /> },
            { path: "/game-stats", element: <StatsTable /> },
          ],
        },
      ],
    },
    {
      element: <PublicRoute />,
      children: [
        {
          path: "/login",
          element: <LoginCard />,
        },
      ],
    },
  ]);

  return <RP router={router} />;
};
