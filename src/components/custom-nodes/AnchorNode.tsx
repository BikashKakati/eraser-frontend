// src/components/custom-nodes/AnchorNode.tsx
import { Position, Handle, type NodeProps } from '@xyflow/react';
import React from 'react';
import type { AnchorNodeType } from '../../types';
import { useActiveToolStore } from '../../store/zustand-store';
import { sidebarTools } from '../../constant';

const AnchorNode: React.FC<NodeProps<AnchorNodeType>> = ({ id, data, ...props }) => {
    const { activeTool } = useActiveToolStore();
    const { identityType, isVisible } = data;

    console.log("props", props)

    // Only allow resizing/interacting if we are in 'select' mode and it's visible.
    const showHandle = isVisible && activeTool === sidebarTools.SELECT;

    return (
        <div style={{ width: 12, height: 12, transform: 'translate(-50%, -50%)' }} className="relative flex justify-center items-center">
            {/* Invisible native Handle with 0px bounds so edge connects mathematically to the center point */}
            <Handle
                position={data.handlePosition || (identityType === 'source' ? Position.Top : Position.Bottom)}
                type={identityType}
                id={id}
                isConnectable={false}
                className="!w-0 !h-0 !min-w-0 !min-h-0 !border-0 !transform-none !bg-transparent opacity-0 pointer-events-none"
                style={{ top: '50%', left: '50%' }}
            />
            {/* Visual handle element serving as target for mouse dragging */}
            <div
                className={`w-3 h-3 bg-blue-500 border-2 border-white rounded-full transition-opacity duration-200 ${showHandle ? 'opacity-100 pointer-events-auto cursor-crosshair' : 'opacity-0 pointer-events-none'}`}
            />
        </div>
    );
};

export default AnchorNode;