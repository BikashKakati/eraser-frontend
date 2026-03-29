import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Outlet />
        </div>
    );
}
