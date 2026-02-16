import React from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { environment } from "@/environments/environment";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, accessToken, setAccessToken } =
    React.useContext(AuthContext);

  async function refreshAccessToken(): Promise<string> {
    try {
      const response = await axios.get(
        `${environment.services.auth}/auth/refresh`,
        {
          withCredentials: true,
        },
      );
      return response.data.access_token;
    } catch {
      return "";
    }
  }

  const logout = async () => {
    axios
      .get(`${environment.services.auth}/auth/logout`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(null);
          setAccessToken(null);
        }
      })
      .catch((error) => {
        console.error("Unable to logout:", error);
        // Invalid token, do nothing
      });
  };

  const fetchUserInfo = () => {
    axios
      .get(`${environment.services.auth}/user/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        logout();
        navigate("/", { replace: true });
        // Invalid token, do nothing
      });
  };

  React.useEffect(() => {
    // This covers the following scenarios:
    // 1. No/Invalid access token - When there is no/invalid access token set in context.
    // 2. Access token but no user info - When there is a valid access token but the user info is not set in context.
    // 3. Access token and user info - When there is a valid access token and user info is also set in context. This scenraio is the positive case.
    const checkInfo = async () => {
      if (accessToken === null) {
        const token = await refreshAccessToken();
        if (token === "") {
          logout();
          navigate("/", { replace: true });
        }
      }
      if (!user && accessToken) {
        fetchUserInfo();
      }
    };

    checkInfo();
  }, [accessToken]);

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
