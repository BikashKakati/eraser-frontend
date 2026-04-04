import { Button } from "../../../components/common/Button";

export function CTASection() {
    return (
        <section className="py-24 px-6 text-center border-t border-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-violet-500/10 blur-[100px] pointer-events-none" />
            <h2 className="text-4xl font-bold mb-6">Start building your first flow</h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto">Experience the fastest way to turn abstract logic into visual architecture.</p>
            <Button to="/editor/new" variant="primary" size="lg" className="px-8 py-4 text-lg">
                Create New Flow
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </Button>
        </section>
    );
}
