import type { NodeProps } from "@xyflow/react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import type { CustomNodeType } from "../../types/custom-node-types";
import { useStore } from "../../store/zustand-store";
import { useRef, useState, useCallback, memo } from "react";

export const CustomNodeComponent: React.FC<NodeProps<CustomNodeType>> = memo(({
  data,
  selected,
  width,
  height,
}) => {
  const { activeTool } = useStore();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'arrow' || !nodeRef.current) return;

    // Prevent event bubbling to stop React Flow's panning
    event.stopPropagation();

    const bounds = nodeRef.current.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    const nodeWidth = width || 150;
    const nodeHeight = height || 100;
    const threshold = 15;

    let isOnBorder = false;
    let startPos: { x: number; y: number } | null = null;

    if (data.shape === 'circle') {
      const centerX = nodeWidth / 2;
      const centerY = nodeHeight / 2;
      const radius = Math.min(nodeWidth, nodeHeight) / 2;
      const dx = localX - centerX;
      const dy = localY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (Math.abs(dist - radius) < threshold) {
        isOnBorder = true;
        // Project to exact border position
        const angle = Math.atan2(dy, dx);
        startPos = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
      }
    } else {
      // Rectangle border detection
      const isNearTop = localY < threshold && localX >= 0 && localX <= nodeWidth;
      const isNearBottom = localY > nodeHeight - threshold && localX >= 0 && localX <= nodeWidth;
      const isNearLeft = localX < threshold && localY >= 0 && localY <= nodeHeight;
      const isNearRight = localX > nodeWidth - threshold && localY >= 0 && localY <= nodeHeight;

      if (isNearTop) {
        isOnBorder = true;
        startPos = { x: localX, y: 0 };
      } else if (isNearBottom) {
        isOnBorder = true;
        startPos = { x: localX, y: nodeHeight };
      } else if (isNearLeft) {
        isOnBorder = true;
        startPos = { x: 0, y: localY };
      } else if (isNearRight) {
        isOnBorder = true;
        startPos = { x: nodeWidth, y: localY };
      }
    }

    if (isOnBorder && startPos) {
      setIsConnecting(true);
      setConnectionStart(startPos);
      console.log('Connection started at:', startPos); // Debug log
    }
  }, [activeTool, width, height, data.shape]);

  const handleMouseUp = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Don't clear connection state on mouse leave - let it persist until mouse up
  }, []);

  const nodeStyle: React.CSSProperties = {
    width: width ? `${width}px` : '150px',
    height: height ? `${height}px` : '100px',
    borderRadius: data.shape === 'circle' ? '50%' : '12px',
  };

  let cursorClass = '';
  if (activeTool === 'select') cursorClass = 'cursor-move';
  else if (activeTool === 'arrow') cursorClass = 'cursor-crosshair';

  return (
    <div
      ref={nodeRef}
      style={nodeStyle}
      className={`bg-white border-2 border-neutral-800 relative group ${cursorClass}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Node Resizer - only in select mode */}
      <NodeResizer
        isVisible={selected && activeTool === 'select'}
        minWidth={40}
        minHeight={40}
        lineClassName="border-blue-500"
        handleClassName="bg-blue-500 border-2 border-white h-2.5 w-2.5 rounded-full"
      />

      {/* Blue ball at connection start point - only visible during connection */}
      {isConnecting && connectionStart && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${connectionStart.x}px`,
            top: `${connectionStart.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
            style={{
              boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.7)',
            }}
          />
        </div>
      )}

      {/* Target handle - invisible, covers entire node for easy connection */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        className="!opacity-0 !w-full !h-full !rounded-none !bg-transparent !border-0"
        style={{ left: 0, top: 0 }}
        isConnectable={activeTool === 'arrow'}
      />

      {/* Source handle - invisible, covers entire node for connection start */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!opacity-0 !w-full !h-full !rounded-none !bg-transparent !border-0"
        style={{ left: 0, top: 0 }}
        isConnectable={activeTool === 'arrow'}
      />
    </div>
  );
});