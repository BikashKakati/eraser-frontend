// RectangleNode.tsx
import { NodeResizer, Position, type NodeProps } from '@xyflow/react';
import React from 'react';
import type { ShapeNode } from '../../../types';
import { useActiveToolStore } from '../../../store/zustand-store';
import AnchorPoint from '../../anchor-point/AnchorPoint';


const RectangleNode: React.FC<NodeProps<ShapeNode>> = ({ data = {}, selected, id, width, height }) => {
  const nodeWidth = width ?? 320;
  const nodeHeight = height ?? 192;
  const margin = 10;
  const spaceBetweenSvgNRect = 6;
  const wrapperWidth = nodeWidth + margin * 2;
  const wrapperHeight = nodeHeight + margin * 2;

  const CORNER_RADIUS = 25; // rounded-[25px]
  const STROKE_WIDTH = 2; // same as border-[2px]

  const { activeTool } = useActiveToolStore();





  return (
    <div className="relative flex items-center justify-center" style={{ width: wrapperWidth, height: wrapperHeight }}>

      <svg
        width={nodeWidth + spaceBetweenSvgNRect}
        height={nodeHeight + spaceBetweenSvgNRect}
      >
        <rect
          x={spaceBetweenSvgNRect / 2 + STROKE_WIDTH / 2}
          y={spaceBetweenSvgNRect / 2 + STROKE_WIDTH / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx={CORNER_RADIUS}
          ry={CORNER_RADIUS}
          fill="transparent"
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
      </svg>

      <div style={{ position: 'absolute', left: margin, top: margin, width: nodeWidth, height: nodeHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <p className="text-center select-none px-2">{data.textContent}</p>
        <AnchorPoint position={Position.Right} type='source' id="right" isConnectable={true} />
        <AnchorPoint position={Position.Left} type='source' id="left" isConnectable={true} />
      </div>

      {
        activeTool === "arrow" ? null : (
          <NodeResizer
            nodeId={id}
            isVisible={selected}
            minWidth={100 + margin * 2}
            minHeight={80 + margin * 2}
            keepAspectRatio={false}
            lineClassName="rounded-[28px] !border-2 !border-blue-500"
            handleClassName="!w-3 !h-3 !bg-blue-500 !border-2 !rounded-sm !border-white rounded-full shadow-md"
          />
        )

      }
    </div>
  );
};

export default RectangleNode;
