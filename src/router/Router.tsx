import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import PublicLayout from "../components/layouts/PublicLayout";
import FlowbitCanvasPage from "../pages/flowbit-canvas/FlowbitCanvasPage";
import FlowsPage from "../pages/flows/FlowsPage";
import LandingPage from "../pages/landing/LandingPage";

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
            { path: "editor/:id", element: <FlowbitCanvasPage /> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
