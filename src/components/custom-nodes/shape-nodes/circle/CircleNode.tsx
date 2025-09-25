import {
  NodeResizer,
  type NodeProps
} from "@xyflow/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { ShapeNode } from "../../../../types";

const CircleNode: React.FC<NodeProps<ShapeNode>> = ({ data = {}, selected, id, width, height }) => {
  const margin = 10;
  const innerW = width ?? 240;
  const innerH = height ?? 240;
  const wrapperW = innerW + margin * 2;
  const wrapperH = innerH + margin * 2;
  const [arrowMode, setArrowMode] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // marker state: visible only when hover close to circumference and arrowMode on
  const [marker, setMarker] = useState<{
    visible: boolean;
    cx: number;
    cy: number;
    angleDeg: number;
  }>({ visible: false, cx: 0, cy: 0, angleDeg: 0 });

  const radius = useMemo(() => Math.min(innerW, innerH) / 2, [innerW, innerH]);
  const center = useMemo(() => ({ x: innerW / 2, y: innerH / 2 }), [innerW, innerH]);

  // tweakable values
  const THRESHOLD = 8; // how close the pointer must be to the circumference
  const markerRadius = 17; // increased marker size (default 10)

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!arrowMode) return;

      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      // coordinates relative to svg top-left
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      const dx = localX - center.x;
      const dy = localY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // check proximity to circumference
      if (Math.abs(dist - radius) <= THRESHOLD) {
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;

        // clamp marker to exact circumference position (so marker sits on the circle)
        const cx = center.x + Math.cos(angleRad) * radius;
        const cy = center.y + Math.sin(angleRad) * radius;

        setMarker({ visible: true, cx, cy, angleDeg });
      } else {
        setMarker((m) => (m.visible ? { ...m, visible: false } : m));
      }
    },
    [center.x, center.y, arrowMode, radius]
  );

  const handlePointerLeave = useCallback(() => {
    setMarker((m) => (m.visible ? { ...m, visible: false } : m));
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: wrapperW,
        height: wrapperH,
      }}
    >
      {/* SVG circle placed exactly at left:margin top:margin inside wrapper */}
      <svg
        ref={svgRef}
        className=""
        width={innerW}
        height={innerH}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Background / optional fill */}
        <rect x={0} y={0} width={innerW} height={innerH} fill="transparent" />

        {/* Circle (visual node) */}
        <circle
          cx={center.x}
          cy={center.y}
          r={radius - 1.5} /* subtract border half if you will add stroke width */
          stroke="black"
          strokeWidth={2}
          fill="transparent"
        />

        {/* MARKER: only a point on circumference (no inner line). bigger + outlined for visibility */}
        {marker.visible && (
          <circle
            cx={marker.cx}
            cy={marker.cy}
            r={markerRadius}
            fill="#0ea5e9"
            stroke="#ffffff"
            strokeWidth={2}
            className="!z-50"
          />
        )}
      </svg>

      {/* Optional text / label centered over circle using absolute overlay */}
      <div
        className="absolute left-[20px] top-[20px] w-full h-full pointer-events-none flex items-center justify-center"
        style={{ width: innerW, height: innerH }}
      >
        <p className="text-center select-none px-2">{data.textContent}</p>
      </div>

      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={80 + margin * 2}
        minHeight={80 + margin * 2}
        keepAspectRatio={false}
        lineClassName="!border-2 !border-blue-500"
        handleClassName="!w-3 !h-3 !bg-blue-500 !border-2 !border-white rounded-full shadow-md transform transition-transform hover:scale-110"
      />
    </div>
  );
};

export default CircleNode;
