import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider as RP,
} from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { MainLayout } from "../features/sidebar";
import { PageLoader } from "../pages/page-loader";
import { ErrorPage } from "../pages/error-page";
import { LoginCardWithRegister } from "../features/login/login-register";

export const PATHS = {
  LOGIN: "/login",
  SEARCH: "/search",
  BACKLOG: "/backlog",
  PLAYING: "/playing",
  STATS: "/game-stats",
  LOGIN_REGISTER: "/login-register",
} as const;

const Backlog = lazy(() => import("../pages/backlog-page"));
const SearchGames = lazy(() => import("../pages/search-games-page"));
const Playing = lazy(() => import("../pages/playing-page"));
const StatsTable = lazy(() => import("../pages/game-stats"));
const LoginCard = lazy(() =>
  import("../features/login/login").then((m) => ({ default: m.LoginCard })),
);

export const RouterProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to={PATHS.SEARCH} replace />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <MainLayout />,
              children: [
                {
                  path: PATHS.BACKLOG,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <Backlog />
                    </Suspense>
                  ),
                },
                {
                  path: PATHS.SEARCH,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <SearchGames />
                    </Suspense>
                  ),
                },
                {
                  path: PATHS.PLAYING,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <Playing />
                    </Suspense>
                  ),
                },
                {
                  path: PATHS.STATS,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <StatsTable />
                    </Suspense>
                  ),
                },
              ],
            },
          ],
        },
        {
          element: <PublicRoute />,
          children: [
            {
              path: PATHS.LOGIN,
              element: (
                <Suspense fallback={<PageLoader />}>
                  <LoginCard />
                </Suspense>
              ),
            },
            {
              path: PATHS.LOGIN_REGISTER,
              element: (
                <Suspense fallback={<PageLoader />}>
                  <LoginCardWithRegister />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "*",
          element: <Navigate to={PATHS.SEARCH} />,
        },
      ],
    },
  ]);

  return <RP router={router} />;
};
