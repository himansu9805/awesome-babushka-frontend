import React, { useEffect, useRef } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { environment } from "@/environments/environment";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = React.useContext(AuthContext);
  const [cookies] = useCookies(["access_token", "refresh_token"]);
  const hasSetUser = useRef(false);

  let accessToken = cookies.access_token;
  let refreshToken = cookies.refresh_token;

  useEffect(() => {
    if (!user && accessToken && refreshToken && !hasSetUser.current) {
      try {
        const decodedAccessToken = JSON.parse(
          atob(accessToken.split(".")[1])
        );
        setUser(decodedAccessToken);
        hasSetUser.current = true;
      } catch (e) {
        axios.get(
          `${environment.services.auth}/auth/refresh`,
          { withCredentials: true, headers: { Authorization: `Bearer ${refreshToken}` } }
        )
          .then((response) => {
            accessToken = response.data.access_token;
            const decodedAccessToken = JSON.parse(
              atob(accessToken.split(".")[1])
            );
            setUser(decodedAccessToken);
            hasSetUser.current = true;
          })
          .catch((error) => {
            console.error("Error refreshing token:", error);
            navigate("/", { replace: true });
            // Invalid token, do nothing
          });
      }
    }
  }, [user, accessToken, refreshToken, setUser]);


  const isAuthenticated = () => {
    if (user) {
      return true;
    } else if (accessToken && refreshToken) {
      // Don't setUser here!
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
