import { type NodeProps } from '@xyflow/react';
import React from 'react';
import type { CustomGroupNode } from '../../../types';

const GroupNode: React.FC<NodeProps<CustomGroupNode>> = ({ selected, width, height }) => {
    return (
        <div
            className={`relative w-full h-full pointer-events-none ${selected ? 'border-[1px] border-blue-500 border-dotted bg-blue-500/10' : 'border border-transparent'
                }`}
            style={{
                width: width ?? '100%',
                height: height ?? '100%',
            }}
        />
    );
};

export default GroupNode;
