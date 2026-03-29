import { Link } from "react-router-dom";
import { FlowbitLogo } from "../../components/icons/Logo";
import { NodeIcon, ConnectionIcon, GroupingIcon, EditIcon } from "../../components/icons/FeatureIcons";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <FlowbitLogo className="w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">Flowbit</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/flows" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Spaces
                    </Link>
                    <Link
                        to="/flows"
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    >
                        Open Flows
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Abstract Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    Think in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">Flows</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    Design systems visually. Build powerful diagrams, architectures, and structured thinking with an intuitive, developer-friendly canvas.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Link
                        to="/editor/new"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center gap-2"
                    >
                        Start Building
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                    <Link
                        to="/flows"
                        className="px-8 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-lg transition-all"
                    >
                        View Existing Flows
                    </Link>
                </div>
            </section>

            {/* Interactive Preview Section */}
            <section className="relative max-w-5xl mx-auto px-6 py-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="relative w-full aspect-video bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl group cursor-crosshair">
                    {/* Subtle grid background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

                    {/* Mock Canvas Interactive Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Connection Line */}
                        <svg className="w-full h-full" style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))' }}>
                            <path
                                d="M 25% 45% C 40% 45%, 40% 25%, 55% 25%"
                                stroke="#6366f1"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray="100"
                                className="animate-draw-line"
                            />
                            <path
                                d="M 65% 35% C 75% 35%, 75% 65%, 85% 65%"
                                stroke="#22d3ee"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray="100"
                                className="animate-draw-line"
                                style={{ animationDelay: '1s' }}
                            />
                        </svg>

                        {/* Nodes */}
                        <div className="absolute top-[35%] left-[15%] w-32 h-16 bg-slate-900 border-2 border-indigo-500/50 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-float" style={{ animationDelay: '0s' }}>
                            <span className="font-medium text-slate-200">System Entry</span>
                        </div>

                        <div className="absolute top-[15%] left-[45%] w-32 h-16 bg-slate-900 border-2 border-violet-500/50 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-violet-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] animate-float" style={{ animationDelay: '-2s' }}>
                            <span className="font-medium text-slate-200">Processing</span>
                        </div>

                        <div className="absolute top-[55%] left-[75%] w-32 h-16 bg-slate-900 border-2 border-cyan-500/50 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-float" style={{ animationDelay: '-4s' }}>
                            <span className="font-medium text-slate-200">Database</span>
                        </div>
                    </div>

                    {/* Overlay to encourage interaction */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full text-sm text-slate-300 pointer-events-auto">
                        Interactive canvas preview
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
                    <p className="text-slate-400">Everything you need to map out your ideas.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: NodeIcon, title: "Visual Logic", desc: "Build node-based architectures lightning fast." },
                        { icon: ConnectionIcon, title: "Smart Routing", desc: "Arrows snap perfectly and route intelligently." },
                        { icon: GroupingIcon, title: "Structured Thinking", desc: "Nest groups to organize complex sub-systems." },
                        { icon: EditIcon, title: "Fluid Editing", desc: "Dynamically resizing elements and inline text." }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all hover:-translate-y-1 duration-300 group">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform group-hover:text-indigo-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center border-t border-slate-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-violet-500/10 blur-[100px] pointer-events-none" />
                <h2 className="text-4xl font-bold mb-6">Start building your first flow</h2>
                <p className="text-slate-400 mb-10 max-w-md mx-auto">Experience the fastest way to turn abstract logic into visual architecture.</p>
                <Link
                    to="/editor/new"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                >
                    Create New Flow
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </Link>
            </section>
        </div>
    );
}
