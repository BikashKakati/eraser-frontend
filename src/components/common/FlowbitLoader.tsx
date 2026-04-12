import React from 'react';

const FlowbitLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 z-[99999]">
            <div className="relative flex items-center justify-center w-32 h-32 scale-110">
                {/* Node 1 */}
                <div className="absolute left-0 w-10 h-10 rounded-xl bg-white border-[3.5px] border-indigo-500 shadow-xl opacity-90 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.2s' }} />

                {/* Connecting Line */}
                <div className="absolute left-10 right-10 h-[4px] bg-slate-200 overflow-hidden rounded-full">
                    <div className="w-full h-full bg-indigo-500 -translate-x-full animate-[flow_1.5s_ease-in-out_infinite]" />
                </div>

                {/* Node 2 */}
                <div className="absolute right-0 w-10 h-10 rounded-xl bg-white border-[3.5px] border-violet-500 shadow-xl opacity-90 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.2s' }} />

                {/* Top Floating Node */}
                <div className="absolute top-2 w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-400 shadow-lg animate-pulse" style={{ animationDuration: '2s' }} />

                {/* SVG connection from top node to middle */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                    <path d="M 64 36 Q 64 64 64 64" stroke="currentColor" strokeWidth="3" className="text-indigo-400 stroke-dasharray-[8_6] animate-[dash_1.5s_linear_infinite]" fill="none" />
                </svg>
            </div>

            <style>{`
                @keyframes flow {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes dash {
                    to { stroke-dashoffset: -28; }
                }
            `}</style>

            <div className="mt-8 flex flex-col items-center gap-2.5">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 tracking-tight shadow-sm">Flowbit</span>
                </div>
                <p className="text-sm font-semibold text-slate-400/80 tracking-wide animate-pulse uppercase">Assembling canvas...</p>
            </div>
        </div>
    );
};

export default FlowbitLoader;
