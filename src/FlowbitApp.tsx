import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { useAuthStore } from "./store/auth-store";

const FlowbitApp: React.FC = () => {
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    const handleLogout = () => {
      logout();
      window.location.href = '/login';
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout]);

  return (
    <RouterProvider router={router} />
  );
};

export default FlowbitApp;
