import { BaseEdge, getSmoothStepPath, useNodes, type EdgeProps } from "@xyflow/react";
import React from "react";
import type { CustomEdge } from "../../../types";
import { adjustColorBrightness } from "../../../utils/colors";

const ConnectableArrow: React.FC<EdgeProps<CustomEdge>> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  source,
  data,
  target
}) => {
  const nodes = useNodes();

  const [stepTypePath] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition,
    targetPosition
  })

  // The arrow stroke should explicitly highlight if the Edge is selected,
  // OR if either of the  anchor nodes endpoints are selected (being dragged).
  const isEndpointSelected = nodes.some(n => (n.id === source || n.id === target) && n.selected);
  const isSelected = selected || isEndpointSelected;

  const baseColor = data?.arrowColor || "#64748b"; // slate-500
  const displayColor = isSelected ? adjustColorBrightness(baseColor, 0.90) : baseColor;

  return (
    <BaseEdge
      path={stepTypePath}
      markerEnd={markerEnd}
      style={{
        stroke: displayColor,
        strokeWidth: isSelected ? 1.4 : 1.2
      }}
    />
  );
};

export default ConnectableArrow;
