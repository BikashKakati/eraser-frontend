import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import PublicLayout from "../components/layouts/PublicLayout";
import FlowbitLoader from "../components/common/FlowbitLoader";

const FlowbitCanvasPage = lazy(() => import("../pages/flowbit-canvas/FlowbitCanvasPage"));
const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const SpacePage = lazy(() => import("../pages/space/SpacePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignupPage = lazy(() => import("../pages/auth/SignupPage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <Suspense fallback={<FlowbitLoader />}><LandingPage /></Suspense> },
            { path: "login", element: <Suspense fallback={<FlowbitLoader />}><LoginPage /></Suspense> },
            { path: "signup", element: <Suspense fallback={<FlowbitLoader />}><SignupPage /></Suspense> },
        ],
    },
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            { path: "space", element: <Suspense fallback={<FlowbitLoader />}><SpacePage /></Suspense> },
            { path: "editor/:id", element: <Suspense fallback={<FlowbitLoader />}><FlowbitCanvasPage /></Suspense> },
            { path: "settings", element: <Suspense fallback={<FlowbitLoader />}><SettingsPage /></Suspense> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
