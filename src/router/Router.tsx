import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import PublicLayout from "../components/layouts/PublicLayout";
import FlowbitCanvasPage from "../pages/flowbit-canvas/FlowbitCanvasPage";
import LandingPage from "../pages/landing/LandingPage";
import SpacePage from "../pages/space/SpacePage";

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
            { path: "space", element: <SpacePage /> },
            { path: "editor/:id", element: <FlowbitCanvasPage /> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
