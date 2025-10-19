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
}) => {
  const [stepTypePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition})

  
  return (
    <BaseEdge path={stepTypePath} markerEnd={markerEnd} style={{stroke:"#000", strokeWidth:1.5}}/>
  );
};

export default ConnectableArrow;
