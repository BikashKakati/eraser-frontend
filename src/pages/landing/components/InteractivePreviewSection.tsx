import { useCallback } from 'react';
import { ReactFlow, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant, Handle, Position } from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';

const CustomNode = ({ data, selected }: any) => {
    const colors: Record<string, string> = {
        indigo: "border-indigo-500/50 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
        violet: "border-violet-500/50 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
        cyan: "border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
    };
    const colorClass = colors[data.color] || colors.indigo;
    const selectedClass = selected ? "scale-105 border-white shadow-[0_0_25px_rgba(255,255,255,0.3)]" : "";

    return (
        <div className={`w-32 h-16 bg-slate-900 border-2 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${colorClass} ${selectedClass}`}>
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-400 border-none" />
            <span className="font-medium text-slate-200 pointer-events-none">{data.label}</span>
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-400 border-none" />
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [
    { id: '1', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'System Entry', color: 'indigo' } },
    { id: '2', type: 'custom', position: { x: 400, y: 50 }, data: { label: 'Processing', color: 'violet' } },
    { id: '3', type: 'custom', position: { x: 700, y: 200 }, data: { label: 'Database', color: 'cyan' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1', strokeWidth: 3 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#22d3ee', strokeWidth: 3 } },
];

export function InteractivePreviewSection() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } } as unknown as Edge, eds)),
        [setEdges]
    );

    return (
        <section className="relative max-w-5xl mx-auto px-6 py-12 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative w-full aspect-video bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    proOptions={{ hideAttribution: true }}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    className="bg-transparent"
                >
                    <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
                </ReactFlow>

                {/* Overlay to encourage interaction */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full text-sm text-slate-300 pointer-events-none">
                    Try dragging nodes and connecting handles
                </div>
            </div>
        </section>
    );
}
