import React from 'react'

const WrapperField = ({children}:{children:React.ReactNode}) => {
  return (
      <div className='bg-gray-100 p-3 w-full flex flex-col gap-3'>
        {children}
            </div>
  )
}

export default WrapperField