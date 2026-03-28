import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface PrivateRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

function PrivateRoute({ allowedRoles, children }: PrivateRouteProps) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) return <p>Loading...</p>;

  if (!accessToken || !user) {
    return <Navigate to={"/login"} replace={true} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/unauthorized"} replace={true} />;
  }

  return <div>{children}</div>;
}

export default PrivateRoute;
