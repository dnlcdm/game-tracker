import { Navigate, Outlet } from "react-router";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import Header from "../features/header/header";
import { PageLoader } from "../pages/page-loader";

export const ProtectedRoute = () => {
  const { session, isLoading } = useUserAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  );
};
