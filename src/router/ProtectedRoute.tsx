import { Navigate, Outlet } from "react-router";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import Header from "../features/header/header";

export const ProtectedRoute = () => {
  const { session, isLoading } = useUserAuth();

  if (isLoading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};
