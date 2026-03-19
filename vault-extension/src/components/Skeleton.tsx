import React from 'react'

const Skeleton: React.FC<{ width?: string; height?: string; rounded?: boolean }> = ({
  width = '100%',
  height = '16px',
  rounded = false,
}) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: rounded ? '50%' : '6px',
      }}
    />
  )
}

export default Skeleton
