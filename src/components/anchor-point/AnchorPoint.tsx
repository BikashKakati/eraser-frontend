import { Handle, type HandleProps } from '@xyflow/react'
import React from 'react'

const AnchorPoint:React.FC<HandleProps> = (props) => {
  return (
    <Handle
    className='!w-5 !h-5 !bg-blue-500 !border-2 !border-black'
    {...props}
    />
  )
}

export default AnchorPoint