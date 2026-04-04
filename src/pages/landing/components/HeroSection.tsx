import { Button } from "../../../components/common/Button";

export function HeroSection() {
    return (
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
                <Button to="/editor/new" variant="gradient" size="lg">
                    Start Building
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
                <Button to="/flows" variant="secondary" size="lg">
                    View Existing Flows
                </Button>
            </div>
        </section>
    );
}
