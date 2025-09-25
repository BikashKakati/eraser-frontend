import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import React from "react";
import type { CustomEdge } from "../../../types";

const ConnectableArrow: React.FC<EdgeProps<CustomEdge>> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition
}) => {
    const [stepTypePath] = getSmoothStepPath({sourceX, sourceY, targetY, targetX, sourcePosition, targetPosition})
  return (
    <BaseEdge path={stepTypePath}/>
  );
};

export default ConnectableArrow;
