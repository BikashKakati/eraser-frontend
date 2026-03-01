// src/components/custom-nodes/AnchorNode.tsx
import { Position, Handle, type NodeProps } from '@xyflow/react';
import React from 'react';
import type { AnchorNodeType } from '../../types';
import { useActiveToolStore } from '../../store/zustand-store';
import { sidebarTools } from '../../constant';

const AnchorNode: React.FC<NodeProps<AnchorNodeType>> = ({ id, data }) => {
    const { activeTool } = useActiveToolStore();
    const { identityType, isVisible } = data;

    // Only allow resizing/interacting if we are in 'select' mode and it's visible.
    const showHandle = isVisible && activeTool === sidebarTools.SELECT;

    return (
        <div style={{ width: 1, height: 1 }} className="flex justify-center items-center">
            <Handle
                position={data.handlePosition || (identityType === 'source' ? Position.Top : Position.Bottom)}
                type={identityType}
                id={id}
                isConnectable={false}
                className={`!w-3 !h-3 !bg-blue-500 !border-2 !border-white !rounded-full transition-opacity duration-200 ${showHandle ? 'opacity-100 pointer-events-auto cursor-crosshair' : 'opacity-0 pointer-events-none'} !transform-none !top-[-6px] !left-[-6px]`}
            />
        </div>
    );
};

export default AnchorNode;