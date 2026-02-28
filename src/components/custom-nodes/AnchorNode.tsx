// src/components/custom-nodes/AnchorNode.tsx
import { Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import AnchorPoint from '../anchor-point/AnchorPoint';
import type { AnchorNodeType } from '../../types';

const AnchorNode: React.FC<NodeProps<AnchorNodeType>> = ({ data }) => {
    const { identityType } = data;
    return (
        <div style={{ width: 1, height: 1 }}>
            {
                identityType === "source" &&
                    <AnchorPoint
                        position={Position.Top}
                        type='source' id="top"
                        isConnectable={true}
                    />

            }
            {
               identityType === "target" && 
                    <AnchorPoint
                        position={Position.Bottom}
                        type='target' id="bottom"
                        isConnectable={true}
                    />
            }
        </div>
    );
};

export default AnchorNode;