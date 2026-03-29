import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    // In the future, authentication checks can be added here
    // const isAuthenticated = useAuth();
    // if (!isAuthenticated) return <Navigate to="/" />;

    return (
        <Outlet />
    );
}
