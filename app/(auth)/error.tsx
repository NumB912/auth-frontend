'use client'
import React from 'react'
const error = ({error}:{error:Error}) => {
  return (
    <div>error auth {error.message}</div>
  )
}

export default error