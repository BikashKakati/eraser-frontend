import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import PublicLayout from "../components/layouts/PublicLayout";
import FlowbitLoader from "../components/common/FlowbitLoader";

const FlowbitCanvasPage = lazy(() => import("../pages/flowbit-canvas/FlowbitCanvasPage"));
const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const SpacePage = lazy(() => import("../pages/space/SpacePage"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <Suspense fallback={<FlowbitLoader />}><LandingPage /></Suspense> },
        ],
    },
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            { path: "space", element: <Suspense fallback={<FlowbitLoader />}><SpacePage /></Suspense> },
            { path: "editor/:id", element: <Suspense fallback={<FlowbitLoader />}><FlowbitCanvasPage /></Suspense> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
