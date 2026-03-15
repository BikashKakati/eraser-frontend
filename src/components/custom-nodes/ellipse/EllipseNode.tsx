import { NodeResizer, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import React, { useRef, useState, useCallback } from 'react';
import type { ShapeNode } from '../../../types';
import { useActiveToolStore } from '../../../store/zustand-store';
import EditableText from '../../common/EditableText';

const EllipseNode: React.FC<NodeProps<ShapeNode>> = ({ data = {}, selected, id, width, height }) => {
  const nodeMinWidth = 100;
  const nodeMinHeight = 80;
  const nodeWidth = width ?? 240;
  const nodeHeight = height ?? 240;
  const margin = 8;
  const spaceBetweenSvgNEllipse = 6;
  const wrapperWidth = nodeWidth + margin * 2;
  const wrapperHeight = nodeHeight + margin * 2;

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
              textContent: newText,
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
      const padding = 8;
      // An ellipse circumscribing a rectangle of given size has greater height constraints.
      // Roughly expanding height enough to fit text
      const requiredHeight = (size.height + padding) * 1.42;

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

  const dynamicMinWidth = Math.max(nodeMinWidth, (contentSize.width + 8) * 1.42);
  const dynamicMinHeight = Math.max(nodeMinHeight, (contentSize.height + 8) * 1.42);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || activeTool !== 'arrow' || isEditing) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cx = wrapperWidth / 2;
    const cy = wrapperHeight / 2;
    const rx = nodeWidth / 2;
    const ry = nodeHeight / 2;

    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const angle = Math.atan2(dy, dx);

    const r_ellipse = (rx * ry) / Math.sqrt(Math.pow(ry * Math.cos(angle), 2) + Math.pow(rx * Math.sin(angle), 2));
    const dist = Math.sqrt(dx * dx + dy * dy);

    const SNAP_THRESHOLD = 20;

    if (Math.abs(dist - r_ellipse) < SNAP_THRESHOLD) {
      const snapX = cx + r_ellipse * Math.cos(angle);
      const snapY = cy + r_ellipse * Math.sin(angle);

      const deg = angle * 180 / Math.PI;
      let handlePos = Position.Right;
      if (deg > 45 && deg <= 135) handlePos = Position.Bottom;
      else if (deg > 135 || deg <= -135) handlePos = Position.Left;
      else if (deg > -135 && deg <= -45) handlePos = Position.Top;

      setHoverPos({ x: snapX, y: snapY, handlePosition: handlePos });
    } else {
      setHoverPos(null);
    }
  }, [wrapperWidth, wrapperHeight, nodeWidth, nodeHeight, activeTool, isEditing]);

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  const handleAnchorMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hoverPos) {
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
        width={nodeWidth + spaceBetweenSvgNEllipse}
        height={nodeHeight + spaceBetweenSvgNEllipse}
      >
        <ellipse
          cx={(nodeWidth + spaceBetweenSvgNEllipse) / 2}
          cy={(nodeHeight + spaceBetweenSvgNEllipse) / 2}
          rx={nodeWidth / 2}
          ry={nodeHeight / 2}
          fill="transparent"
          stroke="black"
          strokeWidth={STROKE_WIDTH}
        />
      </svg>

      <div style={{ position: 'absolute', left: margin, top: margin, width: nodeWidth, height: nodeHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EditableText
          initialText={data.textContent || ''}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onContentSizeChange={handleContentSizeChange}
        />
      </div>

      {hoverPos && activeTool === 'arrow' && (
        <div
          onMouseDown={handleAnchorMouseDown}
          className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-crosshair z-10"
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
            lineClassName="rounded-[28px] !border-[1.3px] !border-blue-500"
            handleClassName="!w-2 !h-2 !bg-blue-500 !border-1 !rounded-xs !border-white rounded-full shadow-md"
          />
        )

      }
    </div>
  );
};

export default EllipseNode;
