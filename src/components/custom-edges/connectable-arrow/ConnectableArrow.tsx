import { BaseEdge, getSmoothStepPath, useNodes, type EdgeProps } from "@xyflow/react";
import React from "react";
import type { CustomEdge } from "../../../types";

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

  return (
    <BaseEdge path={stepTypePath} markerEnd={markerEnd} style={{ stroke: isSelected ? "#2563eb" : "#000", strokeWidth: isSelected ? 1.5 : 1 }} />
  );
};

export default ConnectableArrow;
