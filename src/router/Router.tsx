import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../components/layouts/PublicLayout";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import LandingPage from "../pages/landing/LandingPage";
import FlowsPage from "../pages/flows/FlowsPage";
import FlowbitApp from "../FlowbitApp";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <LandingPage /> },
        ],
    },
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            { path: "flows", element: <FlowsPage /> },
            { path: "editor/:id", element: <FlowbitApp /> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
