
import { Link } from "react-router-dom";
import { FlowbitLogo } from "../../components/icons/Logo";

export default function FlowsPage() {
    const mockFlows = [
        { id: 1, name: "Authentication Flow", updated: "2 hours ago", color: "indigo" },
        { id: 2, name: "Database Schema", updated: "1 day ago", color: "violet" },
        { id: 3, name: "System Architecture", updated: "3 days ago", color: "cyan" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <FlowbitLogo className="w-8 h-8" />
                    </Link>
                    <span className="text-xl font-semibold">Spaces</span>
                </div>
                <div>
                    <Link
                        to="/editor/new"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        New Flow
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Recent Flows</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Create New Card */}
                    <Link
                        to="/editor/new"
                        className="group flex flex-col items-center justify-center p-6 aspect-[4/3] rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 mb-4 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">Create New Flow</span>
                    </Link>

                    {/* Existing Flows */}
                    {mockFlows.map(flow => (
                        <div key={flow.id} className="group relative flex flex-col p-5 aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">

                            {/* Preview Placeholder */}
                            <Link to={`/editor/${flow.id}`} className="flex-1 bg-slate-950/50 rounded-xl mb-4 overflow-hidden relative group-hover:bg-slate-950 transition-colors border border-slate-800">
                                {/* Abstract Preview Based on color */}
                                <div className={`absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] ${flow.color === 'indigo' ? 'from-indigo-500 via-transparent' :
                                    flow.color === 'violet' ? 'from-violet-500 via-transparent' :
                                        'from-cyan-500 via-transparent'
                                    } to-transparent blur-md group-hover:opacity-40 transition-opacity duration-500`} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FlowbitLogo className="w-8 h-8 opacity-20 grayscale" />
                                </div>
                            </Link>

                            {/* Card Footer */}
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <Link to={`/editor/${flow.id}`} className="block font-medium text-slate-200 group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">
                                        {flow.name}
                                    </Link>
                                    <span className="text-xs text-slate-500">{flow.updated}</span>
                                </div>

                                {/* Actions (Delete placeholder) */}
                                <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100" aria-label="Delete flow">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
