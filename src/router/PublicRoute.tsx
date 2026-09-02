import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import { Navigate, Outlet } from "react-router";
import { PageLoader } from "../pages/page-loader";

export const PublicRoute = () => {
  const { session, isLoading } = useUserAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (session) {
    return <Navigate to="/my-games" replace />;
  }

  return <Outlet />;
};
