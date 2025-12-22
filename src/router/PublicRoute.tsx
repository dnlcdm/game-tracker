import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
  const { session, isLoading } = useUserAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (session) {
    return <Navigate to="/my-games" replace />;
  }

  return <Outlet />;
};
