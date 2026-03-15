// RectangleNode.tsx
import { NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import React, { useRef, useState, useCallback } from 'react';
import type { ShapeNode } from '../../../types';
import { useActiveToolStore } from '../../../store/zustand-store';
import EditableText from '../../common/EditableText';


const RectangleNode: React.FC<NodeProps<ShapeNode>> = ({ data = {}, selected, id, width, height }) => {
  const nodeMinWidth = 100;
  const nodeMinHeight = 80;
  const nodeWidth = width ?? 320;
  const nodeHeight = height ?? 192;
  const margin = 8;
  const spaceBetweenSvgNRect = 6;
  const wrapperWidth = nodeWidth + margin * 2;
  const wrapperHeight = nodeHeight + margin * 2;

  const CORNER_RADIUS = 10; // rounded-[25px]
  const STROKE_WIDTH = 1; // same as border-[2px]

  const { activeTool, setDrawingArrowFrom } = useActiveToolStore();
  const { setNodes } = useReactFlow();

  const [hoverPos, setHoverPos] = useState<{ x: number, y: number, handlePosition: Position } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = useCallback(() => {
    if (selected) {
      setIsEditing(true);
    }
  }, [selected]);

  const handleSave = useCallback((newText: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              content: {
                ...(node.data?.content || {}),
                text: newText,
              },
            },
          };
        }
        return node;
      })
    );
    setIsEditing(false);
  }, [id, setNodes]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleContentSizeChange = useCallback((size: { width: number; height: number }) => {
    setContentSize(size);

    if (isEditing) {
      const padding = 8; // Even tighter padding
      const requiredHeight = size.height + padding;

      if (requiredHeight > nodeHeight) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                height: requiredHeight,
              };
            }
            return node;
          })
        );
      }
    }
  }, [isEditing, nodeHeight, id, setNodes]);

  const dynamicMinWidth = Math.max(nodeMinWidth, contentSize.width + 8);
  const dynamicMinHeight = Math.max(nodeMinHeight, contentSize.height + 8);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || activeTool !== 'arrow' || isEditing) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Define the borders relative to the container
    const leftMargin = margin;
    const rightMargin = wrapperWidth - margin;
    const topMargin = margin;
    const bottomMargin = wrapperHeight - margin;

    // distances to each border
    const distLeft = Math.abs(mouseX - leftMargin);
    const distRight = Math.abs(mouseX - rightMargin);
    const distTop = Math.abs(mouseY - topMargin);
    const distBottom = Math.abs(mouseY - bottomMargin);

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    const SNAP_THRESHOLD = 20; // pixels to snap

    if (minDist < SNAP_THRESHOLD) {
      // Find which border it's closest to and lock to that border
      if (minDist === distLeft) {
        setHoverPos({ x: leftMargin, y: Math.max(topMargin, Math.min(mouseY, bottomMargin)), handlePosition: Position.Left });
      } else if (minDist === distRight) {
        setHoverPos({ x: rightMargin, y: Math.max(topMargin, Math.min(mouseY, bottomMargin)), handlePosition: Position.Right });
      } else if (minDist === distTop) {
        setHoverPos({ x: Math.max(leftMargin, Math.min(mouseX, rightMargin)), y: topMargin, handlePosition: Position.Top });
      } else if (minDist === distBottom) {
        setHoverPos({ x: Math.max(leftMargin, Math.min(mouseX, rightMargin)), y: bottomMargin, handlePosition: Position.Bottom });
      }
    } else {
      setHoverPos(null);
    }
  }, [wrapperWidth, wrapperHeight, activeTool, isEditing]);

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  const handleAnchorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hoverPos) {
      // we need to set the global position as from starting point
      setDrawingArrowFrom({
        x: e.clientX,
        y: e.clientY,
        parentId: id,
        relativeX: hoverPos.x,
        relativeY: hoverPos.y,
        handlePosition: hoverPos.handlePosition
      });
      setHoverPos(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: wrapperWidth, height: wrapperHeight }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >

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
          className={`
            fill-transparent stroke-slate-500 stroke-[1]
            ${selected ? '!stroke-slate-600 stroke-[1] shadow-md' : 'shadow-sm hover:shadow-md'}
          `}
        />
      </svg>

      <div style={{ position: 'absolute', left: margin, top: margin, width: nodeWidth, height: nodeHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EditableText
          initialText={data.content?.text || data.textContent || ''}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onContentSizeChange={handleContentSizeChange}
          className="text-sm text-slate-700 leading-relaxed font-medium"
        />
      </div>

      {hoverPos && activeTool === 'arrow' && (
        <div
          onMouseDown={handleAnchorMouseDown}
          className="absolute w-[14px] h-[14px] bg-indigo-500 border-2 border-white rounded-full cursor-crosshair z-10"
          style={{
            left: hoverPos.x,
            top: hoverPos.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {
        activeTool === "arrow" ? null : (
          <NodeResizer
            nodeId={id}
            isVisible={selected}
            minWidth={dynamicMinWidth + margin * 2}
            minHeight={dynamicMinHeight + margin * 2}
            keepAspectRatio={false}
            lineClassName="!border-indigo-400 rounded-xl !border-[1.2px]"
            handleClassName="!w-2 !h-2 !bg-white !border-2 !border-indigo-500 rounded-full shadow-sm"
          />
        )

      }
    </div>
  );
};

export default RectangleNode;
