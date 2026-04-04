import { Link } from "react-router-dom";
import { FlowbitLogo } from "../../../components/icons/Logo";
import { Button } from "../../../components/common/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
                <FlowbitLogo className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight">Flowbit</span>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/flows" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Spaces
                </Link>
                <Button to="/flows" variant="primary" size="sm">
                    Open Flows
                </Button>
            </div>
        </nav>
    );
}
