import React from 'react'
const layout = (
    { children }
        : { children: React.ReactNode }) => {
    return (

        <div className='flex justify-center w-full'>
            {children}
        </div>
    )
}

export default layout