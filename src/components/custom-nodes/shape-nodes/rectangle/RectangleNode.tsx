import { NodeResizer, type NodeProps } from '@xyflow/react'
import React from 'react'
import type { ShapeNode } from '../../../../types'

const RectangleNode: React.FC<NodeProps<ShapeNode>> = ({ data = {}, selected, id, width, height }) => {
  // base node size (fallback to previous hardcoded values)
  const nodeWidth = width ?? 320
  const nodeHeight = height ?? 192 
  // gap between node and resizer
  const margin = 10
  const wrapperWidth = nodeWidth + margin * 2
  const wrapperHeight = nodeHeight + margin * 2



  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: wrapperWidth,
        height: wrapperHeight,
        // keep wrapper from collapsing to content; it is the element NodeResizer will attach to
      }}
    >
      <div
        className="rounded-[25px] border-[3px] border-black bg-transparent flex items-center justify-center overflow-hidden"
        style={{
          width: nodeWidth,
          height: nodeHeight,
        }}
      >
        <p className="text-center break-words px-2">{data.textContent}</p>
      </div>

      <NodeResizer
      nodeId={id}
        isVisible={selected}
        minWidth={100 + margin * 2}   // min width counts wrapper margin if needed
        minHeight={80 + margin * 2}
        keepAspectRatio={false}
        lineClassName="!border-2 !border-blue-500"
        handleClassName="!w-3 !h-3 !bg-blue-500 !border-2 !rounded-sm !border-white rounded-full shadow-md transform transition-transform"
      />
    </div>
  )
}

export default RectangleNode
