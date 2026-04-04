import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlowbitLogo } from "../../components/icons/Logo";
import { Button } from "../../components/common/Button";
import { SpaceService } from "../../services/api/space-service";
import type { Space } from "../../services/api/space-service";
import { FlowService } from "../../services/api/flow-service";
import type { Flow } from "../../services/api/flow-service";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";

export default function SpacePage() {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);

    // Modal states
    const [isSpaceModalOpen, setSpaceModalOpen] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState("");

    const [isFlowModalOpen, setFlowModalOpen] = useState(false);
    const [newFlowName, setNewFlowName] = useState("");

    useEffect(() => {
        const loadedSpaces = SpaceService.getSpaces();
        setSpaces(loadedSpaces);
        if (loadedSpaces.length > 0 && !activeSpaceId) {
            setActiveSpaceId(loadedSpaces[0].id);
        }
    }, []);

    useEffect(() => {
        if (activeSpaceId) {
            setFlows(FlowService.getFlowsBySpace(activeSpaceId));
        } else {
            setFlows([]);
        }
    }, [activeSpaceId]);

    const handleCreateSpace = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSpaceName.trim()) return;
        const s = SpaceService.createSpace(newSpaceName.trim());
        setSpaces(SpaceService.getSpaces());
        setActiveSpaceId(s.id);
        setNewSpaceName("");
        setSpaceModalOpen(false);
    };

    const handleCreateFlow = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFlowName.trim() || !activeSpaceId) return;
        const f = FlowService.createFlow(activeSpaceId, newFlowName.trim());
        setFlows(FlowService.getFlowsBySpace(activeSpaceId));
        setNewFlowName("");
        setFlowModalOpen(false);
        navigate(`/editor/${f.id}`);
    };

    const activeSpace = useMemo(() => spaces.find(s => s.id === activeSpaceId), [spaces, activeSpaceId]);

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

            {/* LEFT SIDEBAR: Spaces */}
            <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-5 flex items-center gap-3 border-b border-slate-800/50">
                    <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
                        <FlowbitLogo className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tight">Flowbit</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Spaces</h2>
                        <button onClick={() => setSpaceModalOpen(true)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-slate-800">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {spaces.length === 0 ? (
                            <p className="px-2 text-sm text-slate-500 italic">No spaces yet.</p>
                        ) : (
                            spaces.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSpaceId(s.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSpaceId === s.id
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <FolderOpen className={`w-4 h-4 ${activeSpaceId === s.id ? "text-indigo-500" : "text-slate-500"}`} />
                                        <span className="truncate">{s.name}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN PANE: Flows */}
            <main className="flex-1 flex flex-col bg-slate-900/40 relative">
                {/* Header */}
                <header className="h-20 px-10 flex items-center border-b border-slate-800/50 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">{activeSpace ? activeSpace.name : "Spaces"}</h1>
                        {activeSpace && <p className="text-sm text-slate-500 mt-1">Organize and manage flows within this space.</p>}
                    </div>

                    {activeSpace && (
                        <Button variant="primary" size="md" onClick={() => setFlowModalOpen(true)}>
                            <Plus className="w-4 h-4" />
                            New Flow
                        </Button>
                    )}
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10">
                    {!activeSpace ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-slate-800">
                                <FolderOpen className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-200 mb-2">Create a Space</h3>
                            <p className="text-slate-400 text-sm mb-6">You need a space to organize your flows. Create one to get started.</p>
                            <Button variant="primary" onClick={() => setSpaceModalOpen(true)}>Create Space</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Create New Flow Card */}
                            <button
                                onClick={() => setFlowModalOpen(true)}
                                className="group flex flex-col items-center justify-center min-h-[220px] rounded-2xl bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 mb-4 transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">Create New Flow</span>
                            </button>

                            {flows.map(f => (
                                <div key={f.id} className="group relative flex flex-col min-h-[220px] p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
                                    <div className="flex-1 bg-slate-950/50 rounded-xl mb-4 overflow-hidden relative border border-slate-800/80">
                                        <div className="absolute inset-0 opacity-10 group-hover:opacity-30 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 blur-xl transition-opacity duration-500" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FlowbitLogo className="w-8 h-8 opacity-20 grayscale transition-all group-hover:opacity-40 group-hover:grayscale-0" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto px-1">
                                        <div>
                                            <h3 className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">
                                                {f.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">Updated just now</p>
                                        </div>

                                        <Link
                                            to={`/editor/${f.id}`}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 hover:text-white"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* SPACE MODAL */}
            {isSpaceModalOpen && (
                <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                    <form onSubmit={handleCreateSpace} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                        <h2 className="text-2xl font-bold mb-2">New Space</h2>
                        <p className="text-slate-400 text-sm mb-6">Create a workspace to organize related flows.</p>
                        <input
                            type="text"
                            autoFocus
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-6 transition-all"
                            placeholder="e.g. Authentication MVP"
                            value={newSpaceName}
                            onChange={e => setNewSpaceName(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setSpaceModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={!newSpaceName.trim()}>Create</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* FLOW MODAL */}
            {isFlowModalOpen && (
                <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                    <form onSubmit={handleCreateFlow} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                        <h2 className="text-2xl font-bold mb-2">New Flow</h2>
                        <p className="text-slate-400 text-sm mb-6">Create a new diagram within '{activeSpace?.name}'.</p>
                        <input
                            type="text"
                            autoFocus
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-6 transition-all"
                            placeholder="e.g. Login Sequence"
                            value={newFlowName}
                            onChange={e => setNewFlowName(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setFlowModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={!newFlowName.trim()}>Create & Open</Button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}
