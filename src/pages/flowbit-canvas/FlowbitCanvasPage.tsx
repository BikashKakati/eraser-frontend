import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import Sidebar from "../../components/sidebar/Sidebar";
import MainCanvas from "../../components/main-canvas/MainCanvas";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { FlowService } from "../../services/api/flow-service";
import { useEditorStore } from "../../store/editor-store";

const FlowbitCanvasPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const initializeCanvasData = useEditorStore(s => s.initializeCanvasData);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [flowName, setFlowName] = useState("Flow");

    useEffect(() => {
        if (!id) {
            navigate("/space");
            return;
        }

        const flow = FlowService.getFlow(id);
        if (flow) {
            setFlowName(flow.name);
            initializeCanvasData(flow.nodes as any[], flow.edges as any[]);
            setIsLoading(false);
        } else {
            console.error("Flow not found");
            navigate("/space");
        }
    }, [id, navigate, initializeCanvasData]);

    useEffect(() => {
        if (!id || isLoading) return;

        let timeoutId: any;
        const unsub = useEditorStore.subscribe((state, prevState) => {
            // Check if actual diagram components changed
            if (state.nodes === prevState.nodes && state.edges === prevState.edges) return;

            setIsSaving(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const cleanNodes = state.nodes.map((node) => {
                    const { selected, dragging, measured, positionAbsolute, ...rest } = node as any;
                    return rest;
                });
                const cleanEdges = state.edges.map((edge) => {
                    const { selected, ...rest } = edge as any;
                    return rest;
                });
                FlowService.updateFlowData(id, cleanNodes as any, cleanEdges as any);
                console.log("saving");
                setIsSaving(false);
            }, 1000);
        });

        return () => {
            unsub();
            clearTimeout(timeoutId);
        }
    }, [id, isLoading]);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-slate-500 font-medium animate-pulse">Loading canvas...</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden"
            style={{
                backgroundImage: `
          linear-gradient(to bottom right, var(--tw-gradient-stops)),
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
                backgroundSize: '100% 100%, 24px 24px, 24px 24px',
                backgroundColor: '#f8fafc'
            }}
        >
            <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
                <Link to="/space" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Spaces
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700">
                    <span className="font-semibold text-slate-900 border-r border-slate-200 pr-2 mr-1">{flowName}</span>
                    {isSaving ? (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving</span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Saved</span>
                    )}
                </div>
            </div>

            <ReactFlowProvider>
                <Sidebar />
                <MainCanvas />
            </ReactFlowProvider>
        </div>
    )
}

export default FlowbitCanvasPage