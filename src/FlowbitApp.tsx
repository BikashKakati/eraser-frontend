import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";

const FlowbitApp: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default FlowbitApp;
