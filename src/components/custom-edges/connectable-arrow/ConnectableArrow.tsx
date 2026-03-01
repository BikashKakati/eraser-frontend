import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
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
  selected
}) => {
  const [stepTypePath] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition,
    targetPosition
  })

  const isSelected = selected;

  return (
    <BaseEdge path={stepTypePath} markerEnd={markerEnd} style={{ stroke: isSelected ? "#2563eb" : "#000", strokeWidth: isSelected ? 1.5 : 1 }} />
  );
};

export default ConnectableArrow;
