import React from "react";
import { createContext, useContext, useMemo } from "react";
import { ApiClient } from "@/services/ApiClient";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/contexts/AuthContext";
import { ContentService } from "@/services/ContentService";

interface Services {
  authService: AuthService;
  contentService: ContentService;
}

const ServicesContext = createContext<Services | undefined>(undefined);

export const ServicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken } = useAuth();

  const services = useMemo(() => {
    const authApiClient = new ApiClient(
      "http://localhost:8000/api/v1",
      () => accessToken,
    );
    const contentApiClient = new ApiClient(
      "http://localhost:8001/api/v1",
      () => accessToken,
    );

    return {
      authService: new AuthService(authApiClient),
      contentService: new ContentService(contentApiClient),
    };
  }, [accessToken]);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within ServicesProvider");
  }
  return context;
};
