import React from 'react';
import { Group, Ungroup } from 'lucide-react';
import { useEditorStore } from '../../store/editor-store';
import NodeActionGroup from './NodeActionGroup';
import EdgeActionGroup from './EdgeActionGroup';

const ActionBar: React.FC = () => {
    const { selectedNodeIds, selectedEdgeIds, nodes, createGroup, ungroup } = useEditorStore();

    const hasNodes = selectedNodeIds.length > 0;
    const hasEdges = selectedEdgeIds.length > 0;
    const isVisible = hasNodes || hasEdges;

    const canGroup = selectedNodeIds.length > 1;
    const isGroupNodeSelected = selectedNodeIds.length === 1 && nodes.find(n => n.id === selectedNodeIds[0])?.type === 'customGroup';

    return (
        <div
            className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 flex z-[9999]
        transition-all duration-300 ease-out origin-bottom
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}
      `}
        >
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-slate-200/60">
                {hasNodes && <NodeActionGroup nodeIds={selectedNodeIds} />}
                {!hasNodes && hasEdges && <EdgeActionGroup edgeIds={selectedEdgeIds} />}

                {canGroup && (
                    <>
                        {hasNodes && <div className="w-[1px] h-6 bg-slate-200 mx-1" />}
                        <button
                            onClick={createGroup}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150"
                            title="Group Elements"
                        >
                            <Group size={18} strokeWidth={2} />
                        </button>
                    </>
                )}

                {isGroupNodeSelected && (
                    <>
                        {/* We don't show full Node styling for a transparent group folder itself. Just ungroup/delete wrapper. */}
                        <button
                            onClick={ungroup}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
                            title="Ungroup Elements"
                        >
                            <Ungroup size={18} strokeWidth={2} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActionBar;
