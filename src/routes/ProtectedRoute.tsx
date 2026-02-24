import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/contexts/ServicesContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, accessToken, setAccessToken } = useAuth();
  const { authService } = useServices();

  // This covers the following scenarios:
  // 1. No/Invalid access token - When there is no/invalid access token set in context.
  // 2. Access token but no user info - When there is a valid access token but the user info is not set in context.
  // 3. Access token and user info - When there is a valid access token and user info is also set in context. This scenraio is the positive case.

  React.useEffect(() => {
    // Refresh token if needed (runs once on mount)
    const refreshTokenIfNeeded = async () => {
      try {
        if (accessToken === null) {
          const refreshResponse = await authService.refresh();
          setAccessToken(refreshResponse.access_token);
        }
      } catch {
        await authService.logout();
        navigate("/", { replace: true });
      }
    };

    refreshTokenIfNeeded();
  }, []);

  React.useEffect(() => {
    // Fetch user info after token is set
    const fetchUserInfo = async () => {
      try {
        if (accessToken && !user) {
          const userInfo = await authService.getMe();
          setUser(userInfo);
        }
      } catch {
        await authService.logout();
        navigate("/", { replace: true });
      }
    };

    fetchUserInfo();
  }, [accessToken, authService, user, navigate]);

  const isAuthenticated = () => {
    if (user) {
      return true;
    }
    return false;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
