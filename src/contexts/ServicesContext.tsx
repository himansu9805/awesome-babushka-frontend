import React from "react";
import { createContext, useContext, useMemo } from "react";
import { ApiClient } from "@/services/ApiClient";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/contexts/AuthContext";

interface Services {
  authService: AuthService;
}

const ServicesContext = createContext<Services | undefined>(undefined);

export const ServicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken } = useAuth();

  const services = useMemo(() => {
    const apiClient = new ApiClient(
      "http://localhost:8000/api/v1",
      () => accessToken,
    );

    return {
      authService: new AuthService(apiClient),
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
