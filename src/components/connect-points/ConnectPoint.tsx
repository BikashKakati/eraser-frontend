import { Handle, type HandleProps } from '@xyflow/react'
import React from 'react'

const ConnectPoint:React.FC<HandleProps> = (props) => {
  return (
    <Handle
    className='!w-[8px] !h-[8px] !bg-blue-500 !border !border-white'
    {...props}
    />
  )
}

export default ConnectPoint