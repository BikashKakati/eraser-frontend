import { getSmoothStepPath, type ConnectionLineComponentProps } from '@xyflow/react'
import React from 'react'

const ConnectionLine:React.FC<ConnectionLineComponentProps> = ({fromX, fromY, toX, toY}) => {
    const [stepTypePath] = getSmoothStepPath({sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY});
  return (
    <path fill="none" stroke={"black"} strokeWidth={1.5} d={stepTypePath} />
  )
}

export default ConnectionLine