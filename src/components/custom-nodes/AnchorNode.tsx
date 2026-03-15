// src/components/custom-nodes/AnchorNode.tsx
import { Position, Handle, useEdges, type NodeProps } from '@xyflow/react';
import React from 'react';
import type { AnchorNodeType } from '../../types';
import { useActiveToolStore } from '../../store/zustand-store';
import { sidebarTools } from '../../constant';

const AnchorNode: React.FC<NodeProps<AnchorNodeType>> = ({ id, data, selected }) => {
    const { activeTool } = useActiveToolStore();
    const { identityType } = data;
    const edges = useEdges();

    // At one time only one thing can be selected either edge or node, so we are checking if the edge is selected or anchor node is selected belong to the edge, anyone is true means, it is selected.

    const isConnectedEdgeSelected = edges.some(e => e.selected && (e.source === id || e.target === id));
    const isVisible = selected || isConnectedEdgeSelected;
    const showHandle = isVisible && activeTool === sidebarTools.SELECT;

    return (
        <div style={{ transform: 'translate(-50%, -50%)' }} className="relative flex justify-center items-center">
            <Handle
                position={data.handlePosition || (identityType === 'source' ? Position.Top : Position.Bottom)}
                type={identityType}
                id={id}
                isConnectable={false}
                className="!w-0 !h-0 !min-w-0 !min-h-0 !border-0 !transform-none !bg-transparent opacity-0 pointer-events-none"
                style={{ top: '50%', left: '50%' }}
            />

            <div
                className={`w-[14px] h-[14px] bg-indigo-500 border-2 border-white rounded-full transition-all duration-200 ${showHandle ? 'opacity-100 pointer-events-auto cursor-crosshair hover:scale-125' : 'opacity-0 pointer-events-none'}`}
            />
        </div>
    );
};

export default AnchorNode;