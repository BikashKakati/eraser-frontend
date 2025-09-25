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
  markerStart,
}) => {
  const [stepTypePath] = getSmoothStepPath({ sourceX, sourceY, targetY, targetX, sourcePosition, targetPosition})
  return (
    <BaseEdge path={stepTypePath} markerStart={markerStart}/>
  );
};

export default ConnectableArrow;
