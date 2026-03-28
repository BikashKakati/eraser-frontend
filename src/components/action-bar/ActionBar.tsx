import React from 'react';
import { useEditorStore } from '../../store/editor-store';
import NodeActionGroup from './NodeActionGroup';
import EdgeActionGroup from './EdgeActionGroup';

const ActionBar: React.FC = () => {
    const { selectedNodeIds, selectedEdgeIds } = useEditorStore();

    const hasNodes = selectedNodeIds.length > 0;
    const hasEdges = selectedEdgeIds.length > 0;
    const isVisible = hasNodes || hasEdges;

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
            </div>
        </div>
    );
};

export default ActionBar;
